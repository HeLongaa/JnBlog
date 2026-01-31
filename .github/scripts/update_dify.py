import os
import requests
import sys
import json

# Configuration
API_KEY = os.environ.get("DIFY_API_KEY")
DATASET_ID = os.environ.get("DIFY_DATASET_ID")
API_BASE = os.environ.get("DIFY_API_BASE", "https://api.dify.ai/v1")
CHANGED_FILES = os.environ.get("CHANGED_FILES", "").split(",")

def get_document_id(filename):
    """
    Search for a document by name in the Dify dataset.
    Returns the document ID if found, None otherwise.
    """
    if not API_KEY or not DATASET_ID:
        print("Error: DIFY_API_KEY or DIFY_DATASET_ID not set.")
        return None

    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }
    
    # We search by the basename of the file (e.g., 'post.md')
    name = os.path.basename(filename)
    
    # Dify API to list documents
    # GET /datasets/{dataset_id}/documents
    url = f"{API_BASE}/datasets/{DATASET_ID}/documents?keyword={name}&page=1&limit=20"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Iterate through results to find exact name match
        for doc in data.get('data', []):
            if doc['name'] == name:
                return doc['id']
                
    except Exception as e:
        print(f"Error searching for document '{name}': {e}")
        if 'response' in locals():
            print(f"Response: {response.text}")
            
    return None

def create_document(filepath):
    """
    Create a new document in Dify from a file.
    """
    url = f"{API_BASE}/datasets/{DATASET_ID}/document/create-by-file"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }
    
    try:
        # Configuration for the document processing
        data_config = {
            "indexing_technique": "high_quality",
            "process_rule": {
                "mode": "automatic"
            }
        }
        
        filename = os.path.basename(filepath)
        
        # Prepare multipart/form-data
        files = {
            'file': (filename, open(filepath, 'rb'), 'text/markdown'),
            'data': (None, json.dumps(data_config))
        }
        
        print(f"Creating document: {filename}")
        response = requests.post(url, headers=headers, files=files)
        response.raise_for_status()
        print(f"Successfully created document: {filename}")
        
    except Exception as e:
        print(f"Error creating document '{filepath}': {e}")
        if 'response' in locals():
            print(f"Response: {response.text}")

def update_document(document_id, filepath):
    """
    Update an existing document in Dify with a new file.
    """
    url = f"{API_BASE}/datasets/{DATASET_ID}/documents/{document_id}/update-by-file"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
    }
    
    try:
        # Configuration for the document processing
        data_config = {
            "name": os.path.basename(filepath),
            "process_rule": {
                "mode": "automatic"
            }
        }
        
        filename = os.path.basename(filepath)
        
        # Prepare multipart/form-data
        files = {
            'file': (filename, open(filepath, 'rb'), 'text/markdown'),
            'data': (None, json.dumps(data_config))
        }
        
        print(f"Updating document: {filename} (ID: {document_id})")
        response = requests.post(url, headers=headers, files=files)
        response.raise_for_status()
        print(f"Successfully updated document: {filename}")
        
    except Exception as e:
        print(f"Error updating document '{filepath}': {e}")
        if 'response' in locals():
            print(f"Response: {response.text}")

def main():
    if not API_KEY or not DATASET_ID:
        print("Error: Environment variables DIFY_API_KEY and DIFY_DATASET_ID must be set.")
        sys.exit(1)

    print(f"Processing {len(CHANGED_FILES)} changed files...")
    
    for filepath in CHANGED_FILES:
        filepath = filepath.strip()
        if not filepath:
            continue
            
        if not os.path.exists(filepath):
            print(f"File not found (might have been deleted): {filepath}")
            continue
            
        print(f"Processing file: {filepath}")
        
        # 1. Check if document exists
        doc_id = get_document_id(filepath)
        
        # 2. Update or Create
        if doc_id:
            update_document(doc_id, filepath)
        else:
            create_document(filepath)

if __name__ == "__main__":
    main()
