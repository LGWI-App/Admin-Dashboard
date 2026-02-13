# AguaVision Admin Dashboard

Admin dashboard for Life Giving Water International's AguaVision water meter management system.

## Overview

This admin dashboard provides full CRUD (Create, Read, Update, Delete) functionality for managing:

- **Meters**: Water meters across different communities
- **Meter Readings**: Historical and current reading data with usage calculations
- **Communities**: Community groups with pricing configurations

## Features

### Meters Management
- View all water meters with status, household information, and latest readings
- Create new meters with household name, community assignment, and status
- Edit meter information including active status and readings
- View detailed meter information with complete reading history

### Meter Readings Management
- Track all meter readings with water usage calculations
- View current and historical readings
- Monitor pricing based on water consumption
- Automatic calculation of usage increase percentages
- Support for OCR-captured readings from the mobile app

### Communities Management
- Manage water communities with pricing rate configuration
- View community details with meter counts
- Set per-gallon pricing rates
- See example pricing calculations
- Track total meters per community

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Admin Framework**: Refine.dev
- **UI Components**: shadcn/ui + Radix UI
- **Data Management**: Refine data providers
- **Backend**: Supabase (PostgreSQL database)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Database Schema

### METERS Table
- `METER_ID`: Primary key
- `HOUSEHOLD_NAME`: Name of the household
- `COMMUNITY_ID`: Reference to community
- `ACTIVE`: Boolean status
- `LATEST_READING`: Most recent reading value
- `LAST_READ_DATE`: Timestamp of last reading

### METER_READINGS Table
- `entry_id`: Primary key
- `METER_ID`: Reference to meter
- `CURRENT_READING`: Current meter reading
- `LAST_READING`: Previous reading value
- `WATER_USED`: Calculated usage (gallons)
- `PRICE`: Calculated cost
- `DATE_CURRENT`: Current reading timestamp
- `DATE_LAST_READ`: Previous reading timestamp

### COMMUNITY Table
- `COMMUNITY_ID`: Primary key
- `COMMUNITY_NAME`: Community name
- `PRICE_RATE`: Price per gallon

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account with AguaVision database

### Installation

1. Clone the repository:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase credentials:
The app is pre-configured with Supabase credentials in `src/providers/constants.ts`.
Update if needed:
```typescript
export const SUPABASE_URL = "your-supabase-url";
export const SUPABASE_KEY = "your-supabase-anon-key";
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── refine-ui/          # Refine UI components
│   │   ├── buttons/        # Action buttons (Create, Edit, Delete, etc.)
│   │   ├── data-table/     # Data table with pagination and sorting
│   │   ├── form/           # Form components
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   └── theme/          # Theme provider and toggle
│   └── ui/                 # shadcn/ui components
├── pages/
│   ├── dashboard.tsx       # Main dashboard page
│   ├── meters/             # Meters CRUD pages
│   │   ├── list.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   └── show.tsx
│   ├── meter-readings/     # Meter Readings CRUD pages
│   │   ├── list.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   └── show.tsx
│   └── communities/        # Communities CRUD pages
│       ├── list.tsx
│       ├── create.tsx
│       ├── edit.tsx
│       └── show.tsx
├── providers/
│   ├── auth.ts             # Authentication provider
│   ├── data.ts             # Supabase data provider
│   ├── supabase-client.ts  # Supabase client configuration
│   └── constants.ts        # Environment constants
└── App.tsx                 # Main app configuration
```

## Usage

### Dashboard
The main dashboard provides quick access to all resources with overview cards.

### Meters
1. **List**: View all meters with filtering and sorting
2. **Create**: Add new meters by providing household name and community
3. **Edit**: Update meter information and status
4. **Show**: View detailed meter information

### Meter Readings
1. **List**: View all readings with usage and pricing information
2. **Create**: Add manual readings or view OCR-captured readings from mobile app
3. **Edit**: Correct reading data if needed
4. **Show**: View detailed reading information with calculations

### Communities
1. **List**: View all communities with pricing rates
2. **Create**: Add new communities with pricing configuration
3. **Edit**: Update community information and rates
4. **Show**: View community details with meter counts and pricing examples

## Integration with Mobile App

This admin dashboard works in conjunction with the AguaVision mobile app:

- Mobile app users submit meter readings using OCR technology
- Readings are stored in the METER_READINGS table
- Admin dashboard provides oversight and management capabilities
- Admins can view, edit, and manage all data from the mobile submissions

## Key Features

### Data Tables
- Sorting by columns
- Pagination controls
- Responsive design
- Real-time updates with Supabase live provider

### Forms
- Validation
- Error handling
- Auto-save capabilities
- User-friendly inputs

### Access Control
- Ready for authentication integration
- Resource-level permissions
- Action-level access control

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Environment Variables

Required environment variables (configured in `src/providers/constants.ts`):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous key

## Contributing

When adding new resources:
1. Create CRUD pages in `src/pages/[resource-name]/`
2. Add resource configuration to `App.tsx`
3. Define column schemas for list views
4. Create form validations for create/edit views

## License

This project is maintained for Life Giving Water International.

## Support

For support with the AguaVision system:
- Check the mobile app repository: https://github.com/LGWI-App/AguaVision
- Review Supabase database schema and documentation

## Acknowledgments

- Built with [Refine](https://refine.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database and auth by [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev)
