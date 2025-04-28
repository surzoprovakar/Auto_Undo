# ⏪ Automatic Undo Generation for CRDT Operations

This project implements an **automatic approach to generate and actuate undo functionality** for Conflict-Free Replicated Data Type (CRDT) libraries — **without requiring manual modifications** to the original library code.

This work was presented at **IEEE CloudCom 2023**:  
📄 *Undoing CRDT Operations Automatically*, Provakar Mondal and Eli Tilevich.

## Overview

CRDTs (Conflict-free Replicated Data Types) provide strong eventual consistency without complex coordination, but **undoing operations** in CRDTs remains difficult and error-prone.

This project addresses that gap by:
- **Automatically generating undo logic** from library operations.
- **Injecting undo behaviors** without modifying the underlying CRDT implementations.
- **Improving undo efficiency by 16%** over baseline approaches.

## Key Features

- ⚡ **Automatic Undo Generation**: Derives undo operations systematically from CRDT update actions.
- 🛠️ **Non-Invasive Integration**: Does not require altering the original CRDT library code.
- 📈 **Efficiency Gains**: Achieves a **16% improvement** in undo performance.
- 🔄 **Generic Approach**: Can be applied across different types of CRDTs (counters, sets, maps, etc.).
- 🧠 **Script-Based Instrumentation**: Lightweight and adaptable undo scripts tailored to specific CRDT behaviors.

## Technologies Used

- **Go**, **JavaScript**, **Java** — evaluated libraries.
- **Dynamic Analysis and Instrumentation** — for observing and reversing CRDT operations.

## Motivation

While CRDTs guarantee eventual consistency under concurrent updates, **undoing operations in a consistent and efficient manner** is not natively supported by most libraries.

This project proposes an automatic, minimally intrusive solution that improves developer productivity and broadens CRDT adoption in real-world applications needing robust undo support.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/surzoprovakar/Auto_Undo.git
   cd Auto_Undo

## Publication

This work was published in:

> **Undoing CRDT Operations Automatically**  
> Provakar Mondal, Eli Tilevich  
> *IEEE International Conference on Cloud Computing Technology and Science (CloudCom) 2023*.

📄 [Full paper available here](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10475806&casa_token=WtkfdIdDRYQAAAAA:z9uYQAHCWt33qyOF8Hku6wkQE-Kt3eIU97E7nOWLgOLQJJK0lOAjfT4xeNNFt-GjsAOi-WodVOH9).

## Future Work

- Extend undo support to additional CRDT variants (e.g., sequence CRDTs).
- Explore optimization techniques for large-scale undo across distributed replicas.
- Integrate with visual debugging tools for CRDT operations.
