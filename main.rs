use std::process::ExitCode;
use std::env;
use std::time::Duration;
use tokio::time::sleep;

use block_mesh_common::constants::DeviceType;
use block_mesh_common::interfaces::cli::{CliOptMod, CliOpts};
use block_mesh_common::interfaces::server_api::{DashboardRequest, LoginForm};
//use blockmesh_cli::helpers::{dashboard, is_vps, login_to_network};
use blockmesh_cli::helpers::{dashboard, login_to_network};
use blockmesh_cli::login_mode::login_mode;
use clap::Parser;
use logger_general::tracing::setup_tracing;
use uuid::Uuid;

#[macro_use]
pub extern crate tracing;

mod helpers;

#[tokio::main]
pub async fn main() -> anyhow::Result<ExitCode> {

    // Check for the environment variable 'STARTUP_DELAY'
    if let Ok(delay_str) = env::var("STARTUP_DELAY") {
        if let Ok(delay_secs) = delay_str.parse::<u64>() {
            println!("Delaying startup by {} seconds as per STARTUP_DELAY environment variable.", delay_secs);
            sleep(Duration::from_secs(delay_secs)).await;
        } else {
            eprintln!("Invalid STARTUP_DELAY value. Proceeding without delay.");
        }
    }

    let args = CliOpts::parse();
    match args.mode {
        CliOptMod::Login => {
            login_mode(
                &args.url.clone(),
                &args.email,
                &args.password,
                args.depin_aggregator,
            )
            .await?;
        }
        CliOptMod::Register => {
            setup_tracing(Uuid::default(), DeviceType::Cli);
            tracing::info!("Please register via https://app.blockmesh.xyz/register");
            //register(
            //    &args.url,
            //    &RegisterForm {
            //        email: args.email,
            //        password: args.password.clone(),
            //        password_confirm: args.password,
            //        invite_code: args.invite_code,
            //    },
            //)
            //.await?;
        }
        CliOptMod::Dashboard => {
            setup_tracing(Uuid::default(), DeviceType::Cli);
            let api_token = login_to_network(
                &args.url,
                LoginForm {
                    email: args.email.clone(),
                    password: args.password.clone(),
                },
            )
            .await?;
            dashboard(
                &args.url,
                &DashboardRequest {
                    email: args.email.clone(),
                    api_token,
                },
            )
            .await?;
        }
    }
    Ok(ExitCode::SUCCESS)
}
