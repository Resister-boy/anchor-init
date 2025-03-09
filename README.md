### AIShares 2025 Solana Bootcamp Submission Repository

> This repository is for submission for the 2025 Solana Bootcamp. This repository contains Solana Program code based on the Anchor Framework(Rust) and a Next.js(Typescript) based client code to interact with the above Solana Program. AIShare receives users' investment strategies to generate unique trading-specialized AI agents. These AI agents are tokenized by funding them, allowing token holders to share in the profits earned through the AI agents' trading activities. This repository includes the following features:

1. Users can enter your investment strategy to create an AI agent along with its corresponding Fund and Token.
2. Users can transfer SOL to the Fund, and once the Fund is fully funded, they can claim and receive the Token corresponding to the AI agent.
3. Users can exchange the Token back to SOL.

### Program
> Fund Factory Program that creates Funds.

BhJaivSr483tJ2PqodLwZvE85hyRaUUWssqZyYhbqfFX, [SOLSCAN](https://solscan.io/account/BhJaivSr483tJ2PqodLwZvE85hyRaUUWssqZyYhbqfFX?cluster=devnet)

### Screenshot

Generate funds and tokens corresponding to an AI agent through a prompt. [move to](https://ai-shares.vercel.app)
![image](https://github.com/user-attachments/assets/a5abcd64-8839-4e55-a3f3-03c5d2901ede)

Check the funds created by userself or others. [move to](https://ai-shares.vercel.app/fund/list)
![image](https://github.com/user-attachments/assets/80d93bbd-15a4-42b4-bdfe-50e562a4140c)

Check the strategy of the fund creator, the target funding amount, the amount you have funded, and the amounts and percentages contributed by other participants. If you have not funded yet, you can proceed with funding.
![image](https://github.com/user-attachments/assets/9ec18a41-548c-41e8-bbcf-8b249801e276)

If the fund user participated in has reached its target amount, you can claim the corresponding tokens in proportion to your contribution.
![image](https://github.com/user-attachments/assets/ec890870-edb0-4977-ac32-7325655f574e)

Users who have already claimed and own tokens can redeem them for SOL again.
![image](https://github.com/user-attachments/assets/9c430484-e350-467e-9eef-56c917692d47)


### Program Entities

<img width="982" alt="image" src="https://github.com/user-attachments/assets/3d2f6cb7-fa3b-4dab-86ea-4961baa3b579" />

### Diagram 

Architecture
![image](https://github.com/user-attachments/assets/d1ea1bf2-9499-4298-b08d-436931c27501)

State
![image](https://github.com/user-attachments/assets/d6c80f17-2e24-4a5c-8328-a6deaa9dda73)

### Directory Structure
```text
  .
  ├── anchor / # include anchor framework based solana program
  | ├── programs / # source code
  | ├── tests / # test code
  ├── public / # include idl of solana program
  ├── src / # include client code based next.js

  └── README.md
```

### Notification
> To run this project locally, an OpenAI API key is required.
