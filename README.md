# Link Master

A modern web application for creating, managing, and sharing lists of URLs. Built with React, TypeScript, and modern web technologies.

## Features

### URL List Management
- Create named collections of URLs with optional comments
- Support for both individual URL entry and bulk URL input
- Real-time URL validation using regex pattern matching
- Maximum capacity of 50 URLs per list
- Optional comments/descriptions for each URL
- Share lists via unique URLs
- Open all URLs in a list with one click

### User Interface
- Clean, modern UI built with React and Tailwind CSS
- Responsive design that works on desktop and mobile devices
- Dark/light theme support
- Form validation with real-time feedback
- Toast notifications for user actions
- Loading states and error handling
- Smooth animations and transitions

### Technical Implementation

#### Core Technologies
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Zustand** for state management
- **React Hook Form** with Zod for form validation
- **Tailwind CSS** for styling
- **ShadcnUI** components for consistent design

#### Components

##### URL List Creator (`UrlListCreator`)
- Form handling with `react-hook-form`
- Zod schema validation:
  ```typescript
  const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bulkUrls: z.string(),
    urls: z.array(z.object({
      url: z.string().regex(urlRegex, { message: 'Invalid URL' }),
      comment: z.string().optional().default(''),
    })).optional().default([{ url: '', comment: '' }]),
  });
  ```
- Toggle between individual and bulk URL input modes
- Real-time validation and error handling

##### Form Components
- Custom form controls with validation states
- Input fields with error messages
- Textarea for bulk URL input
- Dynamic form fields for URL entries

##### UI Components
- **Button**: Customizable button component with variants
- **Calendar**: Date picker component using `react-day-picker`
- **Card**: Container component for content organization
- **Chart**: Data visualization using `recharts`
- **Form**: Form components with validation integration
- **Input**: Text input component with styling
- **Tabs**: Navigation component
- **Textarea**: Multi-line text input
- **Toast**: Notification system

#### State Management
Using Zustand for global state management:
```typescript
interface State {
  lists: UrlList[];
  addList: (list: UrlList) => Promise<void>;
  getList: (id: string) => Promise<UrlList | null>;
  // ... other state management functions
}
```

#### URL Validation
Regular expression for URL validation:
```typescript
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
```

#### Internationalization
Built-in support for multiple languages:
- English (default)
- Russian
- Extensible translation system

### Project Structure
```
src/
├── components/
│   ├── ui/             # Reusable UI components
│   └── url-list-creator.tsx
├── hooks/
│   ├── use-toast.ts    # Toast notification hook
│   └── use-translation.ts
├── lib/
│   ├── store.ts        # Zustand store
│   ├── translations.ts # Translation strings
│   └── utils.ts        # Utility functions
└── App.tsx            # Main application component
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
VITE_API_URL=your_api_url
```

## Build and Deployment
- TypeScript compilation with strict mode
- Vite build optimization
- CSS minification
- Automatic deployment via Netlify
- Environment variable management

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox for layouts
- CSS Variables for theming
- Progressive enhancement principles

## Performance Considerations
- Code splitting and lazy loading
- Optimized bundle size
- Efficient state management
- Debounced form validation
- Optimized rendering with React hooks

## Security
- URL validation and sanitization
- Form data validation
- Secure state management
- No sensitive data in client-side code

## Future Enhancements
- Export/import URL lists
- Advanced URL organization features
- Additional sharing options
- Enhanced analytics and tracking
- Browser extension integration

## License
MIT License - see LICENSE file for details 