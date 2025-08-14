# Monitoring and Health Checks

This directory contains monitoring configuration and health check implementations for the MERN Bug Tracker application.

## Health Check Endpoints

### Backend Health Check
- **Endpoint**: `GET /health`
- **Purpose**: Verify server is running and responsive
- **Response**: JSON with server status, uptime, and environment info

### API Health Check
- **Endpoint**: `GET /api/health`
- **Purpose**: Verify API routes are accessible
- **Response**: JSON with API status and version info

## Monitoring Setup

### 1. Uptime Monitoring
Set up external monitoring services to ping your health endpoints:

#### UptimeRobot (Free)
- Monitor: `https://your-backend-domain.com/health`
- Check interval: 5 minutes
- Alert on: HTTP status != 200

#### Pingdom
- Monitor: `https://your-backend-domain.com/health`
- Check interval: 1 minute
- Alert on: Response time > 2 seconds

### 2. Error Tracking

#### Sentry Integration
1. Create a Sentry account
2. Add your DSN to environment variables
3. Monitor errors and performance

#### Log Aggregation
- Use services like Loggly, Papertrail, or ELK stack
- Monitor application logs for errors and performance issues

### 3. Performance Monitoring

#### Backend Performance
- Monitor response times
- Track database query performance
- Monitor memory and CPU usage

#### Frontend Performance
- Core Web Vitals
- Page load times
- Bundle size analysis

## Health Check Implementation

The health check endpoint is already implemented in `server.js` and provides:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

## Custom Health Checks

You can extend the health check to include:

- Database connectivity
- External service dependencies
- Memory usage
- Disk space
- Custom business logic

## Alerting

Set up alerts for:
- Service down
- High response times
- Error rate spikes
- Resource usage thresholds

## Maintenance

### Regular Tasks
- Monitor log files
- Check performance metrics
- Update dependencies
- Review error reports
- Backup database

### Incident Response
- Document incident procedures
- Set up escalation paths
- Maintain runbooks
- Post-incident reviews
