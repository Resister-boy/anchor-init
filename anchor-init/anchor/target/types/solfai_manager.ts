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
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidConfigState",
      "msg": "Invalid config state"
    }
  ]
};
