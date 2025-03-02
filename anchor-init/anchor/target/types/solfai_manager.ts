/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solfai_manager.json`.
 */
export type SolfaiManager = {
  "address": "5qrApbBfGrQMmeUjwFmj2d728J4htrFtQzBCe5mzUKaD",
  "metadata": {
    "name": "solfaiManager",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "fundEtfToken",
      "discriminator": [
        111,
        102,
        83,
        123,
        251,
        203,
        6,
        191
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeEtfTokenVault",
      "discriminator": [
        190,
        21,
        22,
        248,
        28,
        170,
        100,
        199
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "etfVault",
          "writable": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "etfName",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "fundingGoal",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "etfTokenVault",
      "discriminator": [
        70,
        242,
        231,
        185,
        71,
        199,
        212,
        215
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidEtfVaultFundingGoal",
      "msg": "Invalid etf vault funding goal"
    }
  ],
  "types": [
    {
      "name": "etfTokenVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "etfName",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "fundedAmount",
            "type": "u64"
          },
          {
            "name": "fundingGoal",
            "type": "u64"
          },
          {
            "name": "fundingStartTime",
            "type": "u64"
          },
          {
            "name": "fundingUserCount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "etfTokenCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
