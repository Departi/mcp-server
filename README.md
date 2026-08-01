# Departi MCP Server

Travel compliance and curated booking for digital nomads and long-term travelers.

Departi helps you navigate the legal complexity of living abroad — visa requirements for any nationality/destination pair, tax residency analysis across 43 countries, Schengen 90/180-day tracking, and persona-curated accommodation, transport, and experience search across 105 European destinations.

## Endpoint

```
https://mcp.departi.eu/v3
```

**Protocol:** Streamable HTTP (JSON-RPC 2.0)
**Authentication:** OAuth 2.1 with PKCE (S256) or anonymous access

## Tools

All 7 tools are read-only with full MCP tool annotations.

### Compliance

| Tool | Description |
|---|---|
| `departi_check_visa` | Visa requirements for 43 European countries. Covers tourist, nomad, work, study, retirement. Includes destination context. Personalizes when registered. |
| `departi_check_tax` | Tax residency analysis for 43 countries. Treaties, DN regimes, social security. Advisory only. |
| `departi_track_schengen` | Schengen 90/180 calculator with tax residency warnings. Persistent tracking when registered. |

### Trip Planning

| Tool | Description |
|---|---|
| `departi_search_accommodation` | Accommodation search across European destinations. Scored by traveler type. Returns booking links. |
| `departi_search_transport` | Flight search: budget and full-service carriers. Returns pricing, stops, booking links. |
| `departi_search_experiences` | Tours, activities, local experiences. Matched to traveler personality. Returns booking links. |

### Profile

| Tool | Description |
|---|---|
| `departi_get_profile` | User profile: preferences, travel history, subscription tier, compliance summary. Requires auth. |

## Quick Start

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "departi": {
      "type": "streamable-http",
      "url": "https://mcp.departi.eu/v3"
    }
  }
}
```

For personalized results (visa checks based on your nationality, Schengen tracking with your travel history), use the OAuth endpoint:

```json
{
  "mcpServers": {
    "departi": {
      "type": "streamable-http",
      "url": "https://mcp.departi.eu/v3/oauth"
    }
  }
}
```

### Claude.ai (Custom Connector)

1. Go to **Settings → Connectors → Add custom connector**
2. Enter URL: `https://mcp.departi.eu/v3/oauth`
3. Approve the OAuth consent screen
4. Connected — try the example prompts below

## Example Prompts

**Visa + Tax (multi-tool):**
> I'm American and planning to work remotely from Lisbon for 3 months starting in September. What visa do I need, and what are the tax implications for my US taxes?

**Schengen tracking:**
> How many Schengen days do I have left? I've been in Portugal since March and Spain since May.

**Trip planning (multi-tool):**
> I want to spend October in Split, Croatia. Find me a place to stay under €1,200/month, some local experiences, and check if I need a visa.

**Tax residency comparison:**
> Compare the tax implications of establishing tax residency in Portugal vs Bulgaria as a US freelancer earning $120K/year.

## Authentication

| Path | Auth | Use Case |
|---|---|---|
| `/v3` | Anonymous + optional Bearer | General queries, registry introspection |
| `/v3/oauth` | OAuth 2.1 required | Personalized results, Schengen tracking, profile access |

### OAuth 2.1 Details

- **PKCE:** S256 (required)
- **Dynamic Client Registration:** RFC 7591
- **Protected Resource Metadata:** RFC 9728
- **Authorization Server Metadata:** RFC 8414
- **Issuer Identification:** RFC 9207
- **Resource Indicators:** RFC 8707
- **Token lifetimes:** Access 1h, refresh 30d with rotation

Discovery endpoints:

```
https://mcp.departi.eu/.well-known/oauth-protected-resource/v3/oauth
https://departi.eu/.well-known/oauth-authorization-server
```

## Use Cases

- Digital nomads checking visa and tax obligations before relocating
- Remote workers understanding FEIE eligibility and tax home rules
- Long-term travelers tracking Schengen days to avoid overstays
- Travel planners finding accommodation, transport, and experiences in one query
- Tax advisors comparing residency regimes across European countries
- AI agents building travel compliance into automated itinerary planning

## Data Coverage

- **Visa data:** 43 European destination countries, all nationalities
- **Tax profiles:** 43 countries with income tax, social security, treaty, and filing data
- **Accommodation:** 105 European destinations with 6,400+ persona-scored properties
- **Transport:** Flights, trains, buses across Europe
- **Experiences:** Activities and tours in all covered destinations

## Links

- [Documentation](https://departi.eu/developers/mcp)
- [Website](https://departi.eu)
- [Privacy Policy](https://departi.eu/privacy)
- [Terms of Service](https://departi.eu/terms)

## Support

- **Email:** support@departi.eu
- **Issues:** [GitHub Issues](https://github.com/Departi/mcp-server/issues)

## License

This repository contains documentation and configuration for the Departi MCP server. The server itself is a hosted service at mcp.departi.eu. See [Terms of Service](https://departi.eu/terms) for usage terms.
