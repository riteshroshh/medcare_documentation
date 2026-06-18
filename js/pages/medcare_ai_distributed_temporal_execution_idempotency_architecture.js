window.PAGES = window.PAGES || {};
window.PAGES['medcare_ai_distributed_temporal_execution_idempotency_architecture'] = () => `
# MedCare AI: Distributed Temporal Execution & Idempotency Architecture
*Author: Principal Distributed Systems Architect (L9)*
*Subject: CCM/PCM Care Management Scheduling, Distributed Locks, and Deterministic Billing*

## 1. Abstract
The MedCare AI platform operates at the nexus of high-throughput telemetry and strict compliance. Specifically, Chronic Care Management (CCM) and Principal Care Management (PCM) require deterministic, to-the-minute tracking of patient interactions over a rolling monthly window. A failure in our scheduling temporal execution model—resulting in duplicate cron executions—translates directly to double-billing Medicare/Medicaid, an unforgivable invariant violation. This document outlines the elite-level distributed systems architecture deployed to guarantee exactly-once semantics for CCM/PCM billing dispatches, leveraging Raft consensus, Redlock distributed mutexes, strictly monotonic fencing tokens, and an immutable idempotency key lifecycle.

## 2. Temporal Execution Models in Distributed Fleets
In a fleet of \`N\` stateless worker nodes, executing a scheduled task exactly once at \`T = t_0\` is fundamentally a consensus problem. Traditional cron binds to a single Unix node, introducing a Single Point of Failure (SPOF). In MedCare AI, we abstract temporal scheduling into a dedicated control plane.

### 2.1 The Two-Tier Scheduler Architecture
1. **The Scheduler Control Plane (SCP):** A Raft-backed cluster of stateful nodes responsible solely for maintaining the temporal index (a distributed priority queue).
2. **The Execution Data Plane (EDP):** A dynamically scaling fleet of worker nodes that consume leases from the SCP.

When a monthly CCM threshold is met (e.g., 20 minutes of staff time), a billing intent is generated. To prevent race conditions where node A and node B simultaneously observe the 20-minute threshold crossing, we decouple the observation from the execution.

### 2.2 Consensus Algorithms: Raft for Leader Election
To maintain the distributed priority queue of upcoming temporal events, the SCP uses Raft. The leader node holds the authoritative view of the timeline.
*   **Heartbeats & Term Election:** The leader broadcasts heartbeats every 50ms. If followers do not receive a heartbeat within the election timeout (150-300ms), a new term begins.
*   **Log Replication:** When a care coordinator logs a new interaction, an event is appended to the Raft log. Only when a quorum (\`N/2 + 1\`) acknowledges the append is the event committed to the state machine.
*   **Byzantine Fault Tolerance (BFT):** While internal nodes are generally trusted, we employ checksums over the replicated log to prevent data corruption from bubbling up into phantom billing events.

## 3. Distributed Locking & Concurrency Control
Even with a reliable SCP, network partitions can cause the SCP to temporarily issue a task to an EDP worker, assume it failed due to a network partition, and re-issue the task. We must protect the billing mutation with a distributed lock.

### 3.1 The Redlock Algorithm
We utilize Redis as a distributed locking mechanism, explicitly implementing the Redlock algorithm to avoid SPOF in the locking layer itself.
Let \`N = 5\` independent Redis master nodes.
To acquire the lock for a CCM billing event \`Lock(patient_id, YYYY-MM)\`, a client performs the following:
1. Obtains the current time \`T_start\` in milliseconds.
2. Tries to acquire the lock in all \`N\` instances sequentially, using the same key name and random value \`V\`. A short timeout (e.g., 5ms) is used for the acquisition to prevent blocking on a dead Redis node.
3. Computes the elapsed time \`T_elapsed = T_current - T_start\`. If and only if the client was able to acquire the lock in the majority of instances (\`>= 3\`) AND \`T_elapsed < Lock_Validity_Time\`, the lock is considered acquired.
4. If the lock was not acquired, the client attempts to unlock all instances.

### 3.2 Mathematical Formulation of Lock Safety
Let \`TTL\` be the lock validity time.
Let \`drift\` be the maximum clock drift between nodes.
The actual time the lock is valid for the client is \`MIN_VALIDITY = TTL - T_elapsed - drift\`.
We configure \`TTL = 10000ms\`, \`T_elapsed ~ 10ms\`, and assume a worst-case NTP drift of \`10ms\`. This provides a massive safety margin for the worker to commit the database transaction.

### 3.3 Clock Drift & Fencing Tokens
Redlock relies on wall-clock time, which is susceptible to NTP skew and leap seconds. To mitigate the "paused process" anomaly (where a GC pause causes a worker to hold a lock past its TTL, wake up, and execute the database mutation concurrently with another node), we implement **Fencing Tokens**.

Every time a lock is acquired, the lock manager returns a strictly monotonically increasing integer (the Fencing Token).
`;
