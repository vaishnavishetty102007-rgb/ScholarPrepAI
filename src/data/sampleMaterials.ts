export interface SampleMaterial {
  id: string;
  title: string;
  topic: string;
  category: string;
  content: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'cellular-respiration',
    title: 'Cellular Respiration & ATP Synthesis',
    topic: 'Biology / Biochemistry',
    category: 'Life Sciences',
    content: `Cellular respiration is the biochemical process by which eukaryotic cells break down glucose in the presence of oxygen to synthesize adenosine triphosphate (ATP), the primary energy currency of the cell. The entire pathway consists of three successive stages: Glycolysis, the Citric Acid Cycle (Krebs cycle), and Oxidative Phosphorylation.

Stage 1: Glycolysis occurs in the cytosol and does not require oxygen (anaerobic). A single molecule of 6-carbon glucose is enzymatically cleaved into two 3-carbon pyruvate molecules. This investment and payoff phase produces a net gain of 2 ATP molecules via substrate-level phosphorylation and 2 NADH reducing equivalents.

Stage 2: The Citric Acid Cycle occurs within the mitochondrial matrix. Before entry, pyruvate is decarboxylated into acetyl-CoA by the pyruvate dehydrogenase complex. Acetyl-CoA combines with oxaloacetate to form citrate. Through sequential redox reactions, each turn yields 3 NADH, 1 FADH2, 1 GTP (converted to ATP), and releases 2 molecules of carbon dioxide (CO2) as metabolic byproduct.

Stage 3: Oxidative Phosphorylation occurs across the inner mitochondrial membrane and yields the bulk of ATP (approximately 28 to 32 ATP per glucose). High-energy electrons donated by NADH and FADH2 travel through electron transport chain (ETC) complexes I through IV. This electron flow drives protons (H+) from the matrix into the intermembrane space, establishing an electrochemical proton gradient. Protons flow back into the matrix through the enzyme ATP synthase via chemiosmosis, powering mechanical rotation to phosphorylate ADP into ATP. Oxygen serves as the terminal electron acceptor, binding free protons to form metabolic water (H2O). If oxygen is absent, the electron transport chain backs up, oxidative phosphorylation ceases, and cells must rely solely on fermentation to regenerate NAD+.`,
  },
  {
    id: 'database-acid',
    title: 'Database Transactions & ACID Properties',
    topic: 'Computer Science',
    category: 'Software Engineering',
    content: `In relational database management systems (RDBMS), a transaction is a logical unit of work that contains one or more database operations (such as SQL INSERT, UPDATE, or DELETE). To ensure reliability and data integrity during system failures, concurrent accesses, and crashes, database engines must guarantee the four ACID properties: Atomicity, Consistency, Isolation, and Durability.

Atomicity (The "All-or-Nothing" Rule): Ensures that every operation within a transaction is executed successfully to completion, or none of them are. If any single query fails midway, the database transaction management rollback mechanism reverts all modifications to the initial state using write-ahead logging (WAL) or undo logs. A classic example is a financial bank transfer: debiting Account A and crediting Account B must either both complete or neither occurs.

Consistency: Ensures that a transaction transitions the database from one valid state to another valid state while preserving all database schemas, constraints, cascades, foreign keys, and triggers. If a transaction attempts to insert a record that violates a UNIQUE constraint or an integrity rule, the engine aborts the transaction and protects database correctness.

Isolation: Governs how concurrent transactions interact and view one another's intermediate data. Without isolation, concurrent transactions experience phenomena such as Dirty Reads (reading uncommitted changes), Non-repeatable Reads (data modified by another transaction midway), and Phantom Reads (rows inserted by another transaction). SQL engines provide four isolation levels using locking or Multi-Version Concurrency Control (MVCC): Read Uncommitted, Read Committed, Repeatable Read, and Serializable.

Durability: Guarantees that once a transaction has committed successfully, its effects and updates persist permanently in non-volatile storage, even in the event of an immediate server crash, power outage, or OS failure. This is achieved by flushing write-ahead logs (WAL) to disk before acknowledging the commit to the client.`,
  },
  {
    id: 'monetary-policy',
    title: 'Monetary Policy, Central Banks & Inflation',
    topic: 'Economics & Finance',
    category: 'Social Sciences',
    content: `Monetary policy refers to the actions undertaken by a nation's central bank (such as the Federal Reserve or the European Central Bank) to influence the availability and cost of money and credit to achieve maximum sustainable employment, price stability, and moderate long-term interest rates.

Central banks possess three primary monetary policy instruments: Open Market Operations (buying or selling government securities), the Policy Interest Rate (such as the federal funds rate or repo rate), and Reserve Requirements (the percentage of deposits commercial banks are mandated to hold in reserve).

Expansionary Monetary Policy (Loose Money): Implemented during economic downturns, recessions, or deflationary risks. The central bank lowers the policy interest rate and purchases government bonds from financial institutions, injecting liquidity into the commercial banking system. Lower borrowing costs incentivize businesses to take commercial loans for capital investment and encourage consumer spending on durable goods and housing. However, excessive expansionary policy risks demand-pull inflation if aggregate demand outpaces aggregate supply.

Contractionary Monetary Policy (Tight Money): Implemented when an economy overheats or inflation climbs substantially above the targeted threshold (typically 2% annually). The central bank raises the benchmark interest rate and sells government bonds, draining reserves from banks. Higher lending rates make auto loans, mortgages, and business credit lines more expensive, dampening aggregate demand, cooling labor market wage pressures, and slowing price increases. The primary risk of contractionary policy is provoking an economic slowdown or technical recession if rates are elevated too aggressively.`,
  },
];
