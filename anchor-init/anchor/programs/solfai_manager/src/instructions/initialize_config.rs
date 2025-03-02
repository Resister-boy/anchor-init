use anchor_lang::prelude::*;

use crate::state::ProgramConfig;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + ProgramConfig::INIT_SPACE,
        seeds = [b"config".as_ref()],
        bump,
    )]
    pub program_config: Account<'info, ProgramConfig>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeConfig<'info> {
    pub fn initialize_config(&mut self, bumps: &InitializeConfigBumps) -> Result<()> {
        dbg!("initialize config");

        self.program_config.set_inner(ProgramConfig {
            admin: self.admin.key(),
            etf_token_count: 0,
            bump: bumps.program_config,
        });

        Ok(())
    }
}