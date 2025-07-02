# Dashboard Project

## Description

The Dashboard provides a fast, modern interface for users to monitor their web application performance metrics. This MVP focuses on essential features while maintaining excellent user experience. Built on top of TailAdmin template for rapid development and consistent UI.

## MVP Features

### Authentication (via Supabase)
- Email/password authentication
- Remember me functionality
- Protected routes
- Reused TailAdmin auth components and layouts

### Quick Start Flow
1. Sign up / Sign in
2. Create first application
   - Enter application name
   - Enter domain
   - Application is automatically linked to user account
3. Get tracking code
4. View initial data

### Application Management
- List all applications using TailAdmin table components
- Create new applications with TailAdmin form components
- View application details
  - Name
  - Domain
  - Creation date
- Applications are user-specific (filtered by user_id)
- Reused TailAdmin modal for application creation

### Core Analytics
- Real-time performance overview
- Core Web Vitals summary
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- Basic metrics
  - Page load time
  - Session count
  - Pageview count

### Essential Visualizations
- Performance score gauge
- Web Vitals trend chart
- Session/pageview timeline
- Top pages table

## Technical Implementation

### UI Framework & Components
- TailAdmin template as base
  - Reused components:
    - Layout components (sidebar, header)
    - Form components (inputs, labels, buttons)
    - Table components
    - Modal components
    - Card components
    - Navigation components
  - Custom components built on top of TailAdmin styles
  - Consistent dark mode support

### Performance Optimizations

#### Initial Load
- Route-based code splitting
- Preload authentication routes
- Lazy load visualization components
- Static landing page
- Optimized font loading

#### Data Loading
- Incremental data fetching
- Pagination with infinite scroll
- Debounced search/filters
- Cached queries
- Loading skeletons

#### Real-time Updates
- Websocket connection (Supabase)
- Optimistic UI updates
- Background data refresh
- Connection status indicator

### Frontend Stack
- Next.js 14 (App Router)
- Tailwind CSS (via TailAdmin)
- Supabase Auth
- Chart.js (lazy loaded)
- React Query

### Component Structure
```
/dashboard
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   └── [appId]/
│   └── layout.tsx
├── components/
│   ├── auth/          # TailAdmin auth components
│   ├── form/          # TailAdmin form components
│   ├── ui/            # TailAdmin UI components
│   │   ├── button/
│   │   ├── table/
│   │   ├── modal/
│   │   └── card/
│   └── metrics/       # Custom metrics components
└── lib/
    ├── supabase.ts
    └── queries.ts
```

### Data Flow
1. User authentication state
2. Application selection
3. Date range selection (default: last 24h)
4. Metrics calculation
5. UI updates

## Development Guidelines

### Component Reuse Strategy
- Leverage TailAdmin components where possible
- Maintain consistent styling with TailAdmin theme
- Extend TailAdmin components for custom functionality
- Follow TailAdmin's component patterns for new features

### Performance First
- Bundle size < 100KB initial load
- Core Web Vitals targets:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Time to Interactive < 3.5s

### Accessibility
- WCAG 2.1 Level AA
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### Error Handling
- Fallback UI components
- Retry mechanisms
- Clear error messages
- Offline indicators

## Deployment

- Vercel Edge Network
- Auto HTTPS/SSL
- Automatic preview deployments
- Performance monitoring

## Future Enhancements (Post-MVP)
- Custom date ranges
- Advanced filtering
- Data export
- Team access
- Custom alerts