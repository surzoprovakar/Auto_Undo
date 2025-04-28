# ⏪ Automatic Undo Generation for CRDT Operations

This project implements an **automatic approach to generate and actuate undo functionality** for Conflict-Free Replicated Data Type (CRDT) libraries — **without requiring manual modifications** to the original library code.

This work was presented at **IEEE CloudCom 2023**:  
📄 *Undoing CRDT Operations Automatically*, Provakar Mondal and Eli Tilevich.

## Getting Started

- Select your target CRDT library and review the corresponding undo scripts.
- Run the instrumentation tool to integrate undo support with your application.

> 🛠️ Detailed usage guides and experimental results are available in the `/docs` folder.

## Publication

This work was published in:

> **Undoing CRDT Operations Automatically**  
> Provakar Mondal, Eli Tilevich  
> *IEEE International Conference on Cloud Computing Technology and Science (CloudCom) 2023*.

📄 [Full paper available here]([https://doi.org/your-doi-link-if-available](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10475806&casa_token=WtkfdIdDRYQAAAAA:z9uYQAHCWt33qyOF8Hku6wkQE-Kt3eIU97E7nOWLgOLQJJK0lOAjfT4xeNNFt-GjsAOi-WodVOH9&tag=1)).

## Future Work

- Extend undo support to additional CRDT variants (e.g., sequence CRDTs).
- Explore optimization techniques for large-scale undo across distributed replicas.
- Integrate with visual debugging tools for CRDT operations.

## License

This project is released under the [MIT License](LICENSE).
