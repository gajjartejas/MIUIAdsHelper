#!/usr/bin/env python3
"""
Script to create required GA4 Custom Dimensions using Google Analytics Admin API (v1beta).

Usage:
  python3 scripts/create_ga4_dimensions.py --property-id <YOUR_GA4_PROPERTY_ID> --token <YOUR_OAUTH_ACCESS_TOKEN>

How to get access token:
  1. Go to Google OAuth 2.0 Playground: https://developers.google.com/oauthplayground
  2. Select 'Google Analytics Admin API v1beta' -> 'https://www.googleapis.com/auth/analytics.edit'
  3. Click 'Authorize APIs' and 'Exchange authorization code for tokens'.
  4. Copy the Access Token and run this script.
"""

import argparse
import json
import urllib.request
import urllib.error

CUSTOM_DIMENSIONS = [
    {
        "parameterName": "device_id",
        "displayName": "Device ID",
        "scope": "EVENT",
        "description": "Unique Hardware Device ID",
    },
    {
        "parameterName": "installed_count",
        "displayName": "Installed Count",
        "scope": "EVENT",
        "description": "Total detected installed activities count",
    },
    {
        "parameterName": "not_installed_count",
        "displayName": "Not Installed Count",
        "scope": "EVENT",
        "description": "Total not installed / disabled activities count",
    },
    {
        "parameterName": "installed_ids",
        "displayName": "Installed IDs",
        "scope": "EVENT",
        "description": "Comma-separated list of installed guide IDs",
    },
    {
        "parameterName": "not_installed_ids",
        "displayName": "Not Installed IDs",
        "scope": "EVENT",
        "description": "Comma-separated list of missing guide IDs",
    },
    {
        "parameterName": "category",
        "displayName": "Category",
        "scope": "EVENT",
        "description": "Activity functional category",
    },
    {
        "parameterName": "installed_apps",
        "displayName": "Installed Apps",
        "scope": "EVENT",
        "description": "List of installed app names in category",
    },
    {
        "parameterName": "missing_apps",
        "displayName": "Missing Apps",
        "scope": "EVENT",
        "description": "List of missing / not installed app names in category",
    },
]

def create_dimensions(property_id: str, token: str):
    base_url = f"https://analyticsadmin.googleapis.com/v1beta/properties/{property_id}/customDimensions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    print(f"Connecting to GA4 Property: {property_id}...\n")

    for dim in CUSTOM_DIMENSIONS:
        param_name = dim["parameterName"]
        req_data = json.dumps(dim).encode("utf-8")
        req = urllib.request.Request(base_url, data=req_data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req) as response:
                if response.status in [200, 201]:
                    print(f" [CREATED] {dim['displayName']} ({param_name})")
                else:
                    print(f" [INFO] Status {response.status} for {param_name}")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            if "already exists" in error_body.lower() or "ALREADY_EXISTS" in error_body:
                print(f" [EXISTS] {dim['displayName']} ({param_name}) is already registered.")
            else:
                print(f" [ERROR] Failed to create {param_name}: {e.code} - {error_body}")
        except Exception as e:
            print(f" [ERROR] Unexpected error for {param_name}: {e}")

    print("\nDone! All Custom Dimensions processed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create GA4 Custom Dimensions via Command Line")
    parser.add_argument("--property-id", required=True, help="GA4 Property ID (e.g. 123456789)")
    parser.add_argument("--token", required=True, help="Google OAuth 2.0 Access Token with analytics.edit scope")
    args = parser.parse_args()

    create_dimensions(args.property_id, args.token)
