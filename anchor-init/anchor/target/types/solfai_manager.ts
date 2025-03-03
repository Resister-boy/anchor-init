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
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "etfVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  102,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "etfTokenVaultId"
              }
            ]
          }
        },
        {
          "name": "userFunding",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  102,
                  117,
                  110,
                  100,
                  100,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "etfTokenVaultId"
              },
              {
                "kind": "account",
                "path": "user"
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
          "name": "etfTokenVaultId",
          "type": "u64"
        },
        {
          "name": "fundAmount",
          "type": "u64"
        }
      ]
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
          "name": "etfTokenMint",
          "writable": true
        },
        {
          "name": "etfTokenMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  102,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "etfTokenMint"
              }
            ]
          }
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
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
          "name": "etfTokenSymbol",
          "type": "string"
        },
        {
          "name": "etfTokenUri",
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
      "name": "etfTokenMetadata",
      "discriminator": [
        93,
        233,
        98,
        68,
        15,
        3,
        58,
        176
      ]
    },
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
    },
    {
      "name": "userFunding",
      "discriminator": [
        192,
        113,
        62,
        236,
        115,
        31,
        75,
        40
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidEtfVaultFundingGoal",
      "msg": "Invalid etf vault funding goal"
    },
    {
      "code": 6001,
      "name": "exceedEtfVaultFundingGoal",
      "msg": "Exceed etf vault funding goal"
    }
  ],
  "types": [
    {
      "name": "etfTokenMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
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
            "name": "etfTokenMint",
            "type": "pubkey"
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
    },
    {
      "name": "userFunding",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "etfTokenVaultId",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "lastUpdated",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
