#!/usr/bin/env python3
"""
Android Kernel Customizer for Windows using WSL
A user-friendly web interface for kernel customization and NetHunter patches

Developed by FiveO
GitHub: https://github.com/FiveOs/android-kernel-customizer
"""

import os
import subprocess
import json
import argparse
import logging
import sys
from pathlib import Path
import shutil
import time

# Set up logging
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("kernel_build.log", mode='a')
    ]
)
logger = logging.getLogger(__name__)

# Configuration file for kernel customization
CONFIG_FILE = "kernel_config.json"

# Default kernel configuration
DEFAULT_CONFIG = {
    "device": "oneplus_nord",
    "codename": "avicii",
    "kernel_repo": "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
    "kernel_branch": "android-10.0",
    "nethunter_patches_repo": "https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project.git",
    "nethunter_patches_branch": "master",
    "nethunter_patches_dir_relative": "nethunter-kernel-patches",
    "git_patch_level": "1",
    "output_dir": "~/kernel_build_output",
    "defconfig_filename_template": "arch/arm64/configs/{codename}_defconfig",
    "kernel_arch": "arm64",
    "kernel_cross_compile": "aarch64-linux-gnu-",
    "kernel_image_name_patterns": ["Image.gz-dtb", "Image.gz", "Image"],
    "features": {
        "wifi_monitor_mode": True,
        "usb_gadget": True,
        "hid_support": True,
        "rtl8812au_driver": False,
    },
    "custom_kernel_configs": [],
    "wsl_distro_name": "kali-linux"
}

def progress_update(percentage, message):
    """Send progress updates that can be parsed by the web interface"""
    print(f"PROGRESS: {percentage}% - {message}", flush=True)
    logger.info(f"Progress: {percentage}% - {message}")

def step_update(step_name):
    """Send step updates that can be parsed by the web interface"""
    print(f"STEP: {step_name}", flush=True)
    logger.info(f"Current step: {step_name}")

def windows_to_wsl_path(windows_path: Path) -> str:
    """Converts an absolute Windows path to its WSL equivalent."""
    abs_windows_path = windows_path.resolve()
    path_str = str(abs_windows_path)

    if ":\\" in path_str:
        drive, rest = path_str.split(":\\", 1)
        return f"/mnt/{drive.lower()}/{rest.replace(os.sep, '/')}"
    
    if path_str.startswith("\\\\"):
        logger.warning(f"UNC path detected: {path_str}. WSL path conversion might be inexact.")
        return path_str.replace(os.sep, '/')

    raise ValueError(f"Path format not recognized or not absolute for WSL conversion: {windows_path}")

def run_command(command: str, shell: bool = False, wsl: bool = False, wsl_distro: str = None):
    """Run a shell command, optionally in a specific WSL distribution."""
    if wsl:
        if not wsl_distro:
            raise ValueError("wsl_distro must be specified if wsl=True")
        
        # For complex commands, wrap with bash -c
        if any(c in command for c in ['|', '&', ';', '<', '>', '(', ')', '$', '`', '\\', '"', "'", '*', '?', '#', '~', '=', '%']):
            wsl_command = ["wsl", "-d", wsl_distro, "--", "bash", "-c", command]
        else:
            wsl_command = ["wsl", "-d", wsl_distro, "--", "bash", "-c", command]
        
        logger.debug(f"Executing WSL command: {' '.join(wsl_command)}")
        result = subprocess.run(wsl_command, check=True, text=True, capture_output=True, encoding='utf-8')
    else:
        logger.debug(f"Executing command: {command}")
        result = subprocess.run(command, shell=shell, check=True, text=True, capture_output=True, encoding='utf-8')

    logger.info(f"Command executed successfully: {command}")
    if result.stdout:
        logger.debug(f"Stdout:\n{result.stdout.strip()}")
    if result.stderr:
        logger.debug(f"Stderr:\n{result.stderr.strip()}")
    return result.stdout

def check_wsl_and_distro(distro_name: str):
    """Check if WSL is installed and the specified distribution is available."""
    step_update("Checking WSL environment")
    progress_update(5, "Verifying WSL installation")
    
    logger.info("Checking WSL and distribution setup...")
    try:
        run_command("wsl --status", shell=True)
        logger.info("WSL is installed.")
        progress_update(7, "WSL found")
    except subprocess.CalledProcessError:
        logger.error("WSL does not seem to be installed or enabled.")
        raise SystemExit("WSL not found. Please install/enable WSL and try again.")

    try:
        distro_list_output = run_command("wsl --list --quiet", shell=True)
        distros = [d.strip().replace('\x00', '') for d in distro_list_output.splitlines() if d.strip()]
        
        if distro_name not in distros:
            logger.error(f"{distro_name} not found in WSL distributions: {distros}")
            raise SystemExit(f"{distro_name} WSL distribution not found. Please install it first.")
        
        logger.info(f"{distro_name} is installed in WSL.")
        progress_update(10, f"Found {distro_name} distribution")
        
        # Test basic WSL functionality
        run_command("echo 'WSL connectivity test'", wsl=True, wsl_distro=distro_name)
        progress_update(12, "WSL connectivity verified")
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Error interacting with WSL or {distro_name}: {e}")
        raise SystemExit(f"WSL or {distro_name} check failed.")

def setup_wsl_environment(config: dict, skip_setup: bool = False):
    """Set up the WSL environment with necessary tools."""
    if skip_setup:
        logger.info("Skipping WSL environment setup as requested.")
        return

    step_update("Setting up WSL environment")
    distro_name = config["wsl_distro_name"]
    progress_update(15, f"Installing build tools in {distro_name}")
    
    logger.info(f"Setting up WSL environment in {distro_name}...")
    
    commands = [
        "sudo apt-get update -y",
        "sudo apt-get install -y git python3 python3-pip bison flex gawk bc ccache device-tree-compiler libssl-dev",
        "sudo apt-get install -y build-essential gcc-aarch64-linux-gnu",
        "sudo apt-get install -y libncurses5-dev"
    ]
    
    for i, cmd in enumerate(commands):
        try:
            logger.info(f"Running in WSL: {cmd}")
            run_command(cmd, wsl=True, wsl_distro=distro_name)
            progress_update(15 + (i + 1) * 2, f"Installing packages ({i + 1}/{len(commands)})")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to execute in WSL: {cmd}. Error: {e}")
            raise SystemExit("WSL environment setup failed.")

def load_config(config_path_str: str) -> dict:
    """Load the kernel configuration file."""
    config_path = Path(config_path_str)
    if not config_path.exists():
        logger.error(f"Configuration file not found: {config_path}")
        raise SystemExit(f"Configuration file {config_path} not found.")
    
    logger.info(f"Loading configuration from {config_path}")
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config_data = json.load(f)
            final_config = DEFAULT_CONFIG.copy()
            final_config.update(config_data)
            return final_config
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from {config_path}: {e}")
        raise SystemExit(f"Invalid JSON in configuration file: {e}")
    except IOError as e:
        logger.error(f"Unable to read config file {config_path}: {e}")
        raise SystemExit(f"Cannot read configuration file: {e}")

def clone_repositories(config: dict, skip_clone: bool = False):
    """Clone kernel and NetHunter patches repositories into WSL."""
    if skip_clone:
        logger.info("Skipping repository cloning as requested.")
        return None, None

    step_update("Cloning repositories")
    output_dir_windows = Path(config["output_dir"]).expanduser().resolve()
    output_dir_windows.mkdir(parents=True, exist_ok=True)
    output_dir_wsl = windows_to_wsl_path(output_dir_windows)
    distro_name = config["wsl_distro_name"]

    kernel_wsl_path_str = f"{output_dir_wsl}/kernel_source"
    nethunter_wsl_path_str = f"{output_dir_wsl}/nethunter_patches_source"

    progress_update(25, "Creating build directories")
    run_command(f"mkdir -p '{output_dir_wsl}'", wsl=True, wsl_distro=distro_name)

    # Clone kernel repository
    progress_update(30, "Cloning kernel repository")
    logger.info(f"Cloning kernel repository to {kernel_wsl_path_str}")
    kernel_repo_url = config["kernel_repo"]
    kernel_branch = config["kernel_branch"]
    
    kernel_clone_cmd = f"if [ ! -d '{kernel_wsl_path_str}/.git' ]; then git clone --depth 1 -b '{kernel_branch}' '{kernel_repo_url}' '{kernel_wsl_path_str}'; else echo 'Kernel directory exists, updating...'; cd '{kernel_wsl_path_str}' && git pull; fi"
    run_command(kernel_clone_cmd, wsl=True, wsl_distro=distro_name)

    # Clone NetHunter patches repository
    progress_update(35, "Cloning NetHunter patches")
    logger.info(f"Cloning NetHunter patches repository to {nethunter_wsl_path_str}")
    nethunter_repo_url = config["nethunter_patches_repo"]
    nethunter_branch = config["nethunter_patches_branch"]
    
    nethunter_clone_cmd = f"if [ ! -d '{nethunter_wsl_path_str}/.git' ]; then git clone --depth 1 -b '{nethunter_branch}' '{nethunter_repo_url}' '{nethunter_wsl_path_str}'; else echo 'NetHunter patches directory exists, updating...'; cd '{nethunter_wsl_path_str}' && git pull; fi"
    run_command(nethunter_clone_cmd, wsl=True, wsl_distro=distro_name)
    
    progress_update(40, "Repository cloning completed")
    return kernel_wsl_path_str, nethunter_wsl_path_str

def apply_kernel_config_tweaks(kernel_wsl_dir: str, config: dict, skip_config_tweaks: bool = False):
    """Apply kernel configuration tweaks to the defconfig file within WSL."""
    if skip_config_tweaks:
        logger.info("Skipping kernel config tweaks as requested.")
        return

    step_update("Applying kernel configuration tweaks")
    progress_update(45, "Configuring kernel features")
    
    distro_name = config["wsl_distro_name"]
    codename = config["codename"]
    defconfig_filename = config["defconfig_filename_template"].format(codename=codename)
    full_defconfig_wsl_path = f"{kernel_wsl_dir.rstrip('/')}/{defconfig_filename}"

    logger.info(f"Applying kernel config tweaks to {full_defconfig_wsl_path}")

    config_tweaks = []
    features = config.get("features", {})
    
    if features.get("wifi_monitor_mode", False):
        config_tweaks.extend([
            "CONFIG_PACKET=y",
            "CONFIG_CFG80211_WEXT=y",
            "CONFIG_MAC80211=y",
            "CONFIG_RFKILL=y",
        ])
    
    if features.get("usb_gadget", False):
        config_tweaks.extend([
            "CONFIG_USB_GADGET=y",
            "CONFIG_USB_CONFIGFS=y",
            "CONFIG_USB_CONFIGFS_F_FS=y", 
            "CONFIG_USB_CONFIGFS_F_ACM=y",
            "CONFIG_USB_CONFIGFS_F_ECM=y",
            "CONFIG_USB_CONFIGFS_F_RNDIS=y",
        ])
    
    if features.get("hid_support", False):
        config_tweaks.extend([
            "CONFIG_USB_CONFIGFS_F_HID=y",
            "CONFIG_UHID=y",
            "CONFIG_HIDRAW=y"
        ])
    
    if features.get("rtl8812au_driver", False):
        config_tweaks.append("CONFIG_RTL8812AU=m")

    custom_configs = config.get("custom_kernel_configs", [])
    config_tweaks.extend(custom_configs)

    if not config_tweaks:
        logger.info("No kernel config tweaks to apply.")
        return

    # Ensure defconfig parent directory exists
    defconfig_parent_dir_wsl = str(Path(full_defconfig_wsl_path).parent)
    run_command(f"mkdir -p '{defconfig_parent_dir_wsl}'", wsl=True, wsl_distro=distro_name)
    run_command(f"touch '{full_defconfig_wsl_path}'", wsl=True, wsl_distro=distro_name)

    for i, tweak in enumerate(config_tweaks):
        if not tweak.strip() or tweak.strip().startswith("#"):
            continue

        escaped_tweak = tweak.replace("'", "'\\''")
        config_name = tweak.split('=')[0]
        
        sed_cmd_delete = f"sed -i '/^{config_name}=/d; /^{config_name} is not set/d' '{full_defconfig_wsl_path}'"
        echo_cmd_add = f"echo '{escaped_tweak}' >> '{full_defconfig_wsl_path}'"
        full_shell_cmd = f"{sed_cmd_delete} && {echo_cmd_add}"
        
        try:
            run_command(full_shell_cmd, wsl=True, wsl_distro=distro_name)
            progress_update(45 + int((i + 1) / len(config_tweaks) * 5), f"Applied config: {config_name}")
        except subprocess.CalledProcessError:
            logger.error(f"Failed to apply tweak: {tweak}")
    
    progress_update(50, "Kernel configuration tweaks applied")

def apply_nethunter_patches(kernel_wsl_dir: str, nethunter_patches_source_wsl_dir: str, config: dict, skip_patches: bool = False):
    """Apply NetHunter patches to the kernel source in WSL."""
    if skip_patches:
        logger.info("Skipping NetHunter patches as requested.")
        return

    step_update("Applying NetHunter patches")
    progress_update(55, "Locating patch files")
    
    distro_name = config["wsl_distro_name"]
    relative_patch_dir = config.get("nethunter_patches_dir_relative", "")
    
    if not relative_patch_dir:
        logger.warning("NetHunter patches directory not specified. Skipping patches.")
        return

    patch_dir_wsl = f"{nethunter_patches_source_wsl_dir.rstrip('/')}/{relative_patch_dir.lstrip('/')}"
    
    try:
        run_command(f"test -d '{patch_dir_wsl}'", wsl=True, wsl_distro=distro_name)
        logger.info(f"Found NetHunter patch directory: {patch_dir_wsl}")
    except subprocess.CalledProcessError:
        logger.warning(f"NetHunter patch directory not found at '{patch_dir_wsl}'. Skipping patching.")
        return

    try:
        ls_cmd = f"find '{patch_dir_wsl}' -maxdepth 1 -type f -name '*.patch' -print0 | sort -z | xargs -0 -n 1 basename"
        patch_files_str = run_command(ls_cmd, wsl=True, wsl_distro=distro_name)
        patch_files = [f.strip() for f in patch_files_str.splitlines() if f.strip()]
    except subprocess.CalledProcessError:
        logger.warning(f"Could not list .patch files from '{patch_dir_wsl}'.")
        patch_files = []

    if not patch_files:
        logger.info("No .patch files found in NetHunter patch directory.")
        return

    patch_level = config.get("git_patch_level", "1")
    total_patches = len(patch_files)
    
    for i, patch_file_name in enumerate(patch_files):
        full_patch_path_wsl = f"{patch_dir_wsl}/{patch_file_name}"
        logger.info(f"Applying patch {i + 1}/{total_patches}: {patch_file_name}")
        
        check_cmd = f"git apply -p{patch_level} --check --verbose '{full_patch_path_wsl}'"
        apply_cmd = f"git apply -p{patch_level} --verbose '{full_patch_path_wsl}'"
        
        wsl_shell_cmd_check = f"cd '{kernel_wsl_dir}' && {check_cmd}"
        wsl_shell_cmd_apply = f"cd '{kernel_wsl_dir}' && {apply_cmd}"

        try:
            run_command(wsl_shell_cmd_check, wsl=True, wsl_distro=distro_name)
            run_command(wsl_shell_cmd_apply, wsl=True, wsl_distro=distro_name)
            progress_update(55 + int((i + 1) / total_patches * 10), f"Applied patch: {patch_file_name}")
            logger.info(f"Successfully applied patch: {patch_file_name}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to apply patch '{patch_file_name}': {e}")
            logger.warning("Continuing with next patch...")

def build_kernel_in_wsl(kernel_wsl_dir: str, config: dict, skip_build: bool = False):
    """Build the kernel in WSL."""
    if skip_build:
        logger.info("Skipping kernel build as requested.")
        return

    step_update("Building kernel")
    progress_update(65, "Starting kernel compilation")
    
    distro_name = config["wsl_distro_name"]
    logger.info(f"Starting kernel build in WSL at {kernel_wsl_dir}")

    arch = config.get("kernel_arch", "arm64")
    cross_compile_prefix = config.get("kernel_cross_compile", "aarch64-linux-gnu-")
    codename = config["codename"]
    defconfig_target = config["defconfig_filename_template"].format(codename=codename).split('/')[-1]

    try:
        nproc_output = run_command("nproc", wsl=True, wsl_distro=distro_name)
        num_cores = nproc_output.strip()
        logger.info(f"Using {num_cores} cores for parallel build")
    except Exception as e:
        logger.warning(f"Could not determine number of cores: {e}. Using 1 core.")
        num_cores = "1"
        
    env_exports = f"export ARCH='{arch}' SUBARCH='{arch}' CROSS_COMPILE='{cross_compile_prefix}' KBUILD_BUILD_USER='NethunterHost' KBUILD_BUILD_HOST='WSL'"

    build_steps = [
        ("Clean previous build", "make clean && make mrproper", 70),
        ("Generate kernel config", f"make '{defconfig_target}'", 75),
        ("Compile kernel", f"make -j{num_cores}", 95)
    ]

    for step_name, step_cmd, progress_target in build_steps:
        full_wsl_shell_cmd = f"cd '{kernel_wsl_dir}' && {env_exports} && {step_cmd}"
        logger.info(f"Build step: {step_name}")
        progress_update(progress_target - 2, step_name)
        
        try:
            run_command(full_wsl_shell_cmd, wsl=True, wsl_distro=distro_name)
            progress_update(progress_target, f"Completed: {step_name}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Kernel build step failed: {step_name}")
            raise SystemExit("Kernel build failed.")

    # Find compiled kernel images
    step_update("Locating kernel images")
    progress_update(97, "Searching for compiled kernel images")
    
    image_patterns = config.get("kernel_image_name_patterns", ["Image.gz-dtb", "Image.gz", "Image"])
    find_cmd_parts = ["find . -maxdepth 3"]
    
    for i, pattern in enumerate(image_patterns):
        find_cmd_parts.append(f"{'-o' if i > 0 else ''} -name '{pattern}'")
    
    find_images_cmd = f"cd '{kernel_wsl_dir}' && {' '.join(find_cmd_parts)}"
    
    try:
        found_images_output = run_command(find_images_cmd, wsl=True, wsl_distro=distro_name)
        found_images = [img.strip() for img in found_images_output.splitlines() if img.strip()]
        
        if found_images:
            logger.info("Found compiled kernel images:")
            for img_path_relative in found_images:
                full_wsl_image_path = f"{kernel_wsl_dir.rstrip('/')}/{img_path_relative.lstrip('./')}"
                logger.info(f"  WSL path: {full_wsl_image_path}")
                
                output_dir_windows = Path(config["output_dir"]).expanduser().resolve()
                win_image_path = output_dir_windows / "kernel_source" / img_path_relative.lstrip('./')
                logger.info(f"  Windows path: {win_image_path.resolve()}")
            
            progress_update(100, f"Build completed successfully! Found {len(found_images)} kernel image(s)")
            step_update("Build completed successfully")
            logger.info("Kernel build completed successfully!")
        else:
            logger.warning("Could not locate compiled kernel images automatically.")
            progress_update(100, "Build completed, but kernel images not found automatically")
            
    except subprocess.CalledProcessError:
        logger.warning("Failed to search for compiled kernel images.")
        progress_update(100, "Build completed")

def main():
    parser = argparse.ArgumentParser(
        description="Android Kernel Customizer for Windows using WSL",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "--config", 
        required=True,
        help="Path to kernel config JSON file"
    )
    parser.add_argument(
        "--skip-env-setup", 
        action="store_true", 
        help="Skip WSL environment setup"
    )
    parser.add_argument(
        "--skip-clone", 
        action="store_true", 
        help="Skip repository cloning"
    )
    parser.add_argument(
        "--skip-patches", 
        action="store_true", 
        help="Skip applying NetHunter patches"
    )
    parser.add_argument(
        "--skip-config-tweaks", 
        action="store_true", 
        help="Skip kernel config tweaks"
    )
    parser.add_argument(
        "--skip-build", 
        action="store_true", 
        help="Skip kernel build"
    )
    parser.add_argument(
        "--clean-output", 
        action="store_true", 
        help="Clean output directory before starting"
    )

    args = parser.parse_args()

    try:
        # Load configuration
        config = load_config(args.config)
        logger.info(f"Building kernel for device: {config['device']} ({config['codename']})")
        
        # Clean output directory if requested
        if args.clean_output:
            output_dir = Path(config["output_dir"]).expanduser().resolve()
            if output_dir.exists():
                logger.info(f"Cleaning output directory: {output_dir}")
                shutil.rmtree(output_dir)
        
        # Check WSL environment
        check_wsl_and_distro(config["wsl_distro_name"])
        
        # Set up WSL environment
        setup_wsl_environment(config, args.skip_env_setup)
        
        # Clone repositories
        kernel_dir, nethunter_dir = clone_repositories(config, args.skip_clone)
        
        if kernel_dir and nethunter_dir:
            # Apply kernel configuration tweaks
            apply_kernel_config_tweaks(kernel_dir, config, args.skip_config_tweaks)
            
            # Apply NetHunter patches
            apply_nethunter_patches(kernel_dir, nethunter_dir, config, args.skip_patches)
            
            # Build kernel
            build_kernel_in_wsl(kernel_dir, config, args.skip_build)
        
        logger.info("Kernel customization process completed successfully!")
        print("BUILD_COMPLETE: Kernel customization finished successfully!", flush=True)
        
    except KeyboardInterrupt:
        logger.info("Build process interrupted by user.")
        print("BUILD_CANCELLED: Build was cancelled by user", flush=True)
        sys.exit(1)
    except SystemExit as e:
        logger.error(f"Build process failed: {e}")
        print(f"BUILD_FAILED: {e}", flush=True)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"BUILD_FAILED: Unexpected error - {e}", flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()