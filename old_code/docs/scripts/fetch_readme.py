import os
import requests
import logging
import time
import yaml

_has_run = False

def load_config(config_file='config.yaml'):
    """Load configuration from YAML file"""
    try:
        with open(config_file, 'r') as file:
            config = yaml.safe_load(file)
        return config
    except FileNotFoundError:
        print(f"Configuration file {config_file} not found")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file: {e}")
        return None
    
def download_github_folder(repo_url, folder_path, output_dir, branch="main"):
    """Download an entire folder from a GitHub repository"""
    # Parse repository URL to get owner and repo name
    if "github.com" in repo_url:
        parts = repo_url.split("/")
        owner = parts[-2]
        repo = parts[-1].replace(".git", "")
    else:
        raise ValueError("Invalid GitHub repository URL")
    
    # GitHub API URL for folder contents
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{folder_path}"
    if branch != "main":
        api_url += f"?ref={branch}"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        contents = response.json()
        
        os.makedirs(output_dir, exist_ok=True)
        
        for item in contents:
            if item["type"] == "file":
                # Download individual file
                file_response = requests.get(item["download_url"])
                file_response.raise_for_status()
                
                file_path = os.path.join(output_dir, item["name"])
                with open(file_path, "wb") as f:
                    f.write(file_response.content)
                
                logging.info(f"Downloaded {item['name']} to {file_path}")
                
            elif item["type"] == "dir":
                # Recursively download subdirectories
                sub_folder_path = f"{folder_path}/{item['name']}" if folder_path else item["name"]
                sub_output_dir = os.path.join(output_dir, item["name"])
                download_github_folder(repo_url, sub_folder_path, sub_output_dir, branch)
    
    except Exception as e:
        logging.error(f"Failed to download folder {folder_path}: {e}")

def fetch_readme(config, **kwargs):
    """
    Download README files and folders from GitHub repositories
    Only runs once per mkdocs process
    """
    global _has_run
    
    if _has_run:
        return
    
    logging.info("Fetching README files from GitHub repositories...")

    config_path = "docs/scripts/readme_config.yaml"
    readme_config = load_config(config_path)

    for repo in readme_config.get("repositories", []):
        name = repo.get("name", "Unknown")
        url = repo.get("url")
        output_path = repo.get("output_path")
        repo_type = repo.get("type", "file")  # "file" or "folder"
        
        if not output_path:
            logging.warning(f"Skipping {name}: missing output path")
            continue
        
        logging.info(f"Fetching {repo_type} for {name}...")
        
        try:
            if repo_type == "folder":
                # Handle folder download
                repo_url = repo.get("repo_url")
                folder_path = repo.get("folder_path", "")
                branch = repo.get("branch", "main")
                
                if not repo_url:
                    logging.error(f"Missing repo_url for folder download: {name}")
                    continue
                
                download_github_folder(repo_url, folder_path, output_path, branch)
                
            else:
                # Handle individual file download
                if not url:
                    logging.warning(f"Skipping {name}: missing URL for file download")
                    continue
                    
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                response = requests.get(url)
                response.raise_for_status()
                
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(response.text)
                
                logging.info(f"Successfully downloaded README for {name} to {output_path}")
                
        except Exception as e:
            logging.error(f"Failed to download {repo_type} for {name}: {e}")
    
    _has_run = True