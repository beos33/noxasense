# API Project

## Description

The API receives performance data and stores it in Supabase.

## Functional Requirements

### Endpoints

- `POST /sessions`: Create session entries.
- `POST /pageviews`: Store pageview metrics.

### Database Schema

Refer to the detailed [Database Schema](./database-schema.md).

## Scalability

- Designed to handle large data volumes efficiently.

## Deployment

- Hosted on Vercel using Serverless Functions for automatic scaling.