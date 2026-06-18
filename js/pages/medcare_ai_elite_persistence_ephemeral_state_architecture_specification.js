window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_elite_persistence_ephemeral_state_architecture_specification'] = () => `
# MedCare AI: Elite Persistence & Ephemeral State Architecture Specification
**Document Classification:** HIGHLY CONFIDENTIAL / L9-INTERNAL
**Author:** Staff DBRE / Persistence Architect
**Target Architecture:** PostgreSQL 16+, Redis 7.2.x, PgBouncer 1.22+, Patroni 3.x
**Focus:** Ultra-High Availability, PHI/PII ACID Compliance, Multi-Tenant EMR Sharding

---

## 1. Architectural Directive & Philosophy

At MedCare AI, the database tier is not merely a data store; it is the source of truth for human life. Clinical systems mandate a zero-tolerance policy for split-brain scenarios, dirty reads in prescription pipelines, and unacknowledged writes. This specification defines our elite-tier, globally distributed persistence fabric. We optimize for a multi-region active-passive topology with synchronous replication across Availability Zones (AZs) and asynchronous replication across geographic regions. 

Our core tenets are:
1.  **Absolute ACID Guarantees over Latency:** For clinical transaction boundaries.
2.  **Predictable P99s:** Achieving <5ms query latency via aggressive memory tuning and connection pooling.
3.  **Horizontal Scale via Sharding:** Cell-based architecture for multi-tenant isolation.
4.  **Ephemeral Decoupling:** Shifting volatile state, rate-limiting, and ML inference caching to Redis Cluster.

---

## 2. Global Replication Topology & High Availability

The replication topology is orchestrated by Patroni, leveraging Consul as the Distributed Configuration Store (DCS) for Raft-based leader election.

### 2.1 Quorum-Based Synchronous Replication
To prevent data loss of critical PHI, we utilize PostgreSQL's quorum-based synchronous replication within the primary region.

\`\`\`ini
# Primary Region (us-east-1)
synchronous_commit = 'on'
synchronous_standby_names = 'ANY 2 (us_east_1b, us_east_1c, us_east_1d)'
\`\`\`

This guarantees that a transaction (e.g., a critical ICU telemetry alert or a new medication order) is physically flushed to the WAL on the primary and at least two replicas before acknowledging the client. 

### 2.2 Patroni State Machine & Split-Brain Fencing
Failover is automated but heavily gated. We employ pre-flight checks to prevent "flapping."

\`\`\`yaml
# patroni.yml snippet
loop_wait: 10
ttl: 30
retry_timeout: 10
maximum_lag_on_failover: 1048576 # 1MB max WAL lag for failover candidacy
primary_stop_timeout: 30
synchronous_mode: true
synchronous_mode_strict: true

tags:
  nofailover: false
  noloadbalance: false
  clonefrom: false
\`\`\`
*STONITH (Shoot The Other Node In The Head):* Integrated with AWS EC2 fencing agents to physically power-cycle an unresponsive primary that still holds the VIP or lock, eliminating split-brain in partial network partitions.

---

## 3. Multi-Tenant EMR Sharding Strategy

MedCare AI ingests data from thousands of clinical facilities. A monolithic schema would collapse under index bloat and vacuum contention. We employ a **Cell-Based Architecture** with native PostgreSQL declarative partitioning and logical sharding.

### 3.1 Logical Sharding by Tenant ID
We route queries at the application layer using a distributed hash ring, mapping \`tenant_id\` to a specific database cell (e.g., \`db-cell-001\` to \`db-cell-064\`).

\`\`\`sql
-- Core EMR Partitioning Strategy within a Cell
CREATE TABLE clinical.encounters (
    encounter_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    clinical_status VARCHAR(50),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    metadata JSONB,
    PRIMARY KEY (tenant_id, started_at, encounter_id)
) PARTITION BY RANGE (started_at);

-- Partition generation via pg_partman
SELECT partman.create_parent(
    p_parent_table := 'clinical.encounters',
    p_control := 'started_at',
    p_type := 'native',
    p_interval := '1 month',
    p_premake := 6
);
\`\`\`

### 3.2 UUIDv7 for Locality
All primary keys utilize UUIDv7 rather than UUIDv4. UUIDv7 includes a 48-bit UNIX timestamp prefix. This ensures sequential inserts into the B-Tree index, radically reducing page splits, WAL amplification, and cache thrashing on massive write throughputs.

---

## 4. ACID Compliance & PHI Data Integrity

Different clinical workflows demand different isolation levels. We strictly enforce isolation semantics at the ORM/Query builder level.

### 4.1 Strict Serializable Isolation for Medication
When a provider prescribes a medication, we must ensure there are no concurrent modifications to the patient's allergy list or contraindicated active prescriptions.

\`\`\`sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Read allergies
SELECT * FROM clinical.allergies WHERE patient_id = '...' AND status = 'ACTIVE';
-- Read active prescriptions
SELECT * FROM clinical.prescriptions WHERE patient_id = '...' AND status = 'ACTIVE';
-- Commit prescription if safe
INSERT INTO clinical.prescriptions (...) VALUES (...);
COMMIT;
\`\`\`
If a serializable serialization failure occurs (SQLSTATE 40001), the application tier executes a jittered exponential backoff and retry.

### 4.2 Read Committed for Telemetry
High-frequency, append-only IoT telemetry from patient monitors uses the default \`READ COMMITTED\` isolation to maximize write throughput, as write-write conflicts are impossible in append-only immutable logs.

---

## 5. Connection Pooling: PgBouncer Topology

PostgreSQL processes are heavy (~10MB per connection). To handle 100k+ concurrent API requests, we deploy PgBouncer as a sidecar proxy on every application node, routing to an HAProxy layer that balances across read replicas.

### 5.1 PgBouncer Configuration (Transaction Pooling)

\`\`\`ini
[databases]
medcare_core = host=primary.db.internal port=5432 dbname=medcare_core
medcare_read = host=ro.db.internal port=5432 dbname=medcare_core

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 200
min_pool_size = 50
reserve_pool_size = 50
reserve_pool_timeout = 3
server_idle_timeout = 60
server_lifetime = 3600

; Disabling prepared statements is required for transaction pooling
; unless pg 14+ / pgbouncer 1.21+ is configured with max_prepared_statements
ignore_startup_parameters = extra_float_digits
max_prepared_statements = 100
\`\`\`
**Architecture Note:** We strictly use \`transaction\` pooling. Connections are returned to the pool immediately after \`COMMIT\` or \`ROLLBACK\`, enabling 200 server connections to multiplex 10,000 client connections seamlessly.

---

## 6. Massive PostgreSQL SQL Tuning Configurations

Standard PostgreSQL configs are designed for a Raspberry Pi. MedCare AI runs on AWS \`r7g.16xlarge\` instances (64 vCPUs, 512GB RAM, NVMe io2 Block Express). The following is our elite-tier tuning baseline.

\`\`\`ini
# ------------------------------------------------------------------------------
# MEDCARE AI POSTGRESQL.CONF EXTREME TUNING
# Hardware: 512GB RAM, 64 vCPU, IO2 Block Express 64,000 IOPS
# ------------------------------------------------------------------------------

# Memory Settings
shared_buffers = 128GB                  # 25% of RAM
work_mem = 64MB                         # Per-sort memory. High because of high concurrent analytics.
maintenance_work_mem = 4GB              # Speeds up VACUUM and CREATE INDEX
effective_cache_size = 384GB            # OS Cache estimate for query planner

# WAL & Checkpointing (Optimized for high write throughput)
wal_level = logical                     # Required for Debezium CDC into Kafka
max_wal_size = 64GB                     # Space out checkpoints
min_wal_size = 16GB
checkpoint_timeout = 15min              # Maximize sequential writes, reduce checkpoint spikes
checkpoint_completion_target = 0.9      # Spread checkpoint writes over 90% of the timeout window
wal_compression = lz4                   # Save network bandwidth on sync replication
wal_buffers = 64MB

# I/O Tuning (NVMe specific)
random_page_cost = 1.1                  # NVMe makes random access almost as fast as sequential
seq_page_cost = 1.0
effective_io_concurrency = 256          # High concurrent I/O requests for EBS io2

# Background Writer & Vacuum (Aggressive tuning to prevent bloat)
autovacuum_max_workers = 10             # More workers for heavily partitioned EMR tables
autovacuum_naptime = 15s                # Wake up frequently
autovacuum_vacuum_threshold = 50        # Trigger vacuum sooner
autovacuum_analyze_threshold = 50
autovacuum_vacuum_scale_factor = 0.02   # 2% of table changed triggers vacuum (down from default 20%)
autovacuum_vacuum_cost_limit = 3000     # Allow vacuum to do more work per cycle
autovacuum_vacuum_cost_delay = 2ms

# Parallel Query Execution
max_worker_processes = 64
max_parallel_workers_per_gather = 16
max_parallel_workers = 32
max_parallel_maintenance_workers = 8    # Fast parallel index creation

# Logging & Auditing (HIPAA Compliance)
log_min_duration_statement = 250        # Log slow queries > 250ms
log_statement = 'ddl'                   # Log all schema changes
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%a.log'
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on                     # Critical for debugging lock contention
\`\`\`

---

## 7. Redis Ephemeral State & Session Fabric

While PostgreSQL guarantees ACID persistence, Redis Cluster manages transient state, API rate limiting, ML inference caching, and real-time FHIR WebSocket broadcast routing.

### 7.1 Redis Cluster Topology
We deploy a 6-node Redis Cluster (3 Masters, 3 Replicas) spread across 3 AZs. This provides a decentralized, master-less architecture capable of 2M+ ops/sec.

### 7.2 Data Structures & Use Cases
- **Rate Limiting (Token Bucket):** Leveraging Redis Lua scripts to execute atomic decrement and window expiration for API Gateway rate-limiting.
- **WebSocket Session Registry:** Storing \`user_id -> node_ip\` mappings using Redis Hashes to route incoming chat/telemetry events to the correct horizontally scaled application pod.
- **ML Inference Cache:** Caching predictive diagnostics (e.g., Sepsis risk scores) using \`SETEX\` with a 15-minute TTL to prevent redundant GPU computation.

### 7.3 Redis Eviction & Memory Policies
To prevent Out-Of-Memory (OOM) crashes under extreme load, we separate our Redis workloads into two logical clusters:
1.  **Cache Cluster:** \`maxmemory-policy allkeys-lru\`. Used for ML inferences and FHIR JSON payloads. If memory fills, least recently used keys are evicted.
2.  **State Cluster:** \`maxmemory-policy noeviction\`. Used for critical WebSocket routing and distributed locks (Redlock). If memory fills, writes fail, triggering scale-out alerts.

\`\`\`redis
# Redis tuning for massive scale
maxmemory 100gb
maxmemory-policy volatile-lru
repl-diskless-sync yes
repl-diskless-sync-delay 5
io-threads 8                 # Enable multi-threaded I/O (Redis 6+)
io-threads-do-reads yes      # Accelerate parallel GET requests
\`\`\`

---

## 8. Disaster Recovery & Zero-Trust Telemetry

### 8.1 Continuous Archiving (WAL-G)
We utilize \`WAL-G\` for continuous base backups and WAL archiving to S3. 
- Base backups execute weekly.
- WAL files are streamed to S3 concurrently.
- RPO (Recovery Point Objective): < 1 second.
- RTO (Recovery Time Objective): < 15 minutes for a 5TB cluster via parallel prefetching (\`WALG_DOWNLOAD_CONCURRENCY=32\`).

### 8.2 Anomaly Detection via pg_stat_statements
We continuously scrape \`pg_stat_statements\` and \`pg_stat_activity\` into Prometheus/Grafana. Alerts trigger if:
1.  Transaction ID wraparound gets within 1B transactions.
2.  \`max_connections\` utilization exceeds 80%.
3.  Replication lag exceeds 50MB.
4.  Cache hit ratio (\`blks_hit / (blks_read + blks_hit)\`) drops below 98%.

## Conclusion
This architecture is built to withstand extreme punishment, regional outages, and the stringent demands of HIPAA/HITECH compliance without sacrificing sub-millisecond query performance. It is the backbone of MedCare AI. End of spec.
</SYSTEM_MESSAGE>
`;
