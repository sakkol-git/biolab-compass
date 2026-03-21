# React Frontend Integration Guide

## Backend Configuration ✅ COMPLETE

Your Laravel backend is now configured to work with a React.js frontend running on `http://localhost:8081`.

### What Was Configured

1. **CORS Settings** (`config/cors.php`)
   - Added `http://localhost:8081` and `http://127.0.0.1:8081` to allowed origins
   - Enabled credentials support for session-based authentication

2. **Sanctum Configuration** (`.env`)
   - Added `localhost:8081` and `127.0.0.1:8081` to stateful domains
   - Session domain set to `localhost`

3. **API Endpoints Available**
   - Base URL: `http://127.0.0.1:8000/api`
   - CSRF Cookie: `http://127.0.0.1:8000/sanctum/csrf-cookie`

---

## React Frontend Setup

### 1. Install Required Packages

```bash
npm install axios
# or
yarn add axios
```

### 2. Configure Axios (Recommended)

Create `src/lib/api.js` or `src/lib/api.ts`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Important for session-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Get CSRF cookie before making authenticated requests
export const getCsrfCookie = async () => {
  await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    withCredentials: true,
  });
};

export default api;
```

### 3. Example: Fetch Plant Species

#### Using Axios (Recommended)

```javascript
import api, { getCsrfCookie } from './lib/api';

// Get all plant species
const fetchPlantSpecies = async () => {
  try {
    const response = await api.get('/plant-species');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching plant species:', error);
    throw error;
  }
};

// Search plant species
const searchPlantSpecies = async (searchTerm) => {
  try {
    const response = await api.get(`/plant-species?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching plant species:', error);
    throw error;
  }
};

// Create a new plant species (requires CSRF token)
const createPlantSpecies = async (data) => {
  try {
    // Get CSRF cookie first (only needed once per session)
    await getCsrfCookie();
    
    const response = await api.post('/plant-species', {
      common_name: data.commonName,
      khmer_name: data.khmerName,
      scientific_name: data.scientificName,
      family: data.family,
      growth_type: data.growthType, // 'annual', 'perennial', or 'biennial'
      native_region: data.nativeRegion,
      propagation_method: data.propagationMethod,
      description: data.description,
      image_url: data.imageUrl,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating plant species:', error);
    throw error;
  }
};

// Update plant species
const updatePlantSpecies = async (id, data) => {
  try {
    await getCsrfCookie();
    const response = await api.put(`/plant-species/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating plant species:', error);
    throw error;
  }
};

// Delete plant species
const deletePlantSpecies = async (id) => {
  try {
    await getCsrfCookie();
    const response = await api.delete(`/plant-species/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting plant species:', error);
    throw error;
  }
};

export {
  fetchPlantSpecies,
  searchPlantSpecies,
  createPlantSpecies,
  updatePlantSpecies,
  deletePlantSpecies,
};
```

#### Using Fetch API

```javascript
// Get CSRF cookie first
const getCsrfCookie = async () => {
  await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    credentials: 'include',
  });
};

// Fetch plant species
const fetchPlantSpecies = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/plant-species', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Create plant species
const createPlantSpecies = async (data) => {
  // Get CSRF cookie first
  await getCsrfCookie();
  
  const response = await fetch('http://127.0.0.1:8000/api/plant-species', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
};
```

### 4. React Component Example

```jsx
import React, { useEffect, useState } from 'react';
import { fetchPlantSpecies, createPlantSpecies } from './lib/api';

function PlantSpeciesList() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlantSpecies();
  }, []);

  const loadPlantSpecies = async () => {
    try {
      setLoading(true);
      const data = await fetchPlantSpecies();
      setSpecies(data.data); // Laravel API resource returns data in 'data' key
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const newSpecies = await createPlantSpecies(formData);
      setSpecies([...species, newSpecies.data]);
    } catch (err) {
      console.error('Failed to create species:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Plant Species</h1>
      <ul>
        {species.map((item) => (
          <li key={item.id}>
            <strong>{item.common_name}</strong> ({item.scientific_name})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlantSpeciesList;
```

### 5. TypeScript Types (Optional)

Create `src/types/plant.ts`:

```typescript
export type GrowthType = 'annual' | 'perennial' | 'biennial';

export interface PlantSpecies {
  id: number;
  common_name: string;
  khmer_name?: string;
  scientific_name: string;
  family?: string;
  growth_type?: GrowthType;
  native_region?: string;
  propagation_method?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PlantSpeciesResponse {
  data: PlantSpecies;
}

export interface PlantSpeciesListResponse {
  data: PlantSpecies[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
```

---

## API Response Format

### Single Resource (GET /api/plant-species/{id})

```json
{
  "data": {
    "id": 1,
    "common_name": "Tomato",
    "khmer_name": "ប៉េងប៉ោះ",
    "scientific_name": "Solanum lycopersicum",
    "family": "Solanaceae",
    "growth_type": "annual",
    "native_region": "South America",
    "propagation_method": "Seeds",
    "description": "A popular garden vegetable",
    "image_url": null,
    "created_at": "2026-02-25T14:30:00.000000Z",
    "updated_at": "2026-02-25T14:30:00.000000Z",
    "deleted_at": null
  }
}
```

### Collection (GET /api/plant-species)

```json
{
  "data": [
    {
      "id": 1,
      "common_name": "Tomato",
      "scientific_name": "Solanum lycopersicum",
      "family": "Solanaceae",
      "growth_type": "annual",
      ...
    },
    {
      "id": 2,
      "common_name": "Pepper",
      "scientific_name": "Capsicum annuum",
      ...
    }
  ],
  "links": {
    "first": "http://127.0.0.1:8000/api/plant-species?page=1",
    "last": "http://127.0.0.1:8000/api/plant-species?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 10,
    "to": 2,
    "total": 2
  }
}
```

---

## Testing the Connection

### 1. Start Backend
```bash
cd /home/sakkol/Documents/Plant-Lap-Laboratory
php artisan serve
```
Backend runs on: `http://127.0.0.1:8000`

### 2. Start React Frontend
```bash
cd your-react-app
npm run dev
# or
npm start
```
Frontend should run on: `http://localhost:8081`

### 3. Test from Browser Console

Open your React app at `http://localhost:8081` and try in the browser console:

```javascript
// Test CORS and API
fetch('http://127.0.0.1:8000/api/plant-species', {
  credentials: 'include',
  headers: { 'Accept': 'application/json' }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify backend is running on `http://127.0.0.1:8000`
2. Verify frontend is on `http://localhost:8081`
3. Check `config/cors.php` has correct origins
4. Clear config: `php artisan config:clear`
5. Restart Laravel server

### 401 Unauthorized Errors

For authenticated requests:
1. Call CSRF cookie endpoint first: `GET /sanctum/csrf-cookie`
2. Use `withCredentials: true` in axios or `credentials: 'include'` in fetch
3. Ensure cookies are enabled in browser

### Network Errors

1. Check Laravel server is running: `php artisan serve`
2. Check no firewall blocking port 8000
3. Try `http://127.0.0.1:8000` instead of `localhost`

---

## Environment Variables for React

Create `.env` in your React project root:

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

Or for Vite-based React:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Then use in code:

```javascript
const API_URL = process.env.REACT_APP_API_URL; // Create React App
// or
const API_URL = import.meta.env.VITE_API_URL; // Vite
```

---

## Next Steps

1. ✅ Backend configured for `http://localhost:8081`
2. ✅ CORS settings updated
3. ✅ Sanctum stateful domains configured
4. 📝 Install axios in React project
5. 📝 Create API service layer
6. 📝 Build React components
7. 📝 Add authentication (login/register)
8. 📝 Handle loading and error states
9. 📝 Add form validation

---

## Quick Test Command

Test if backend is accessible from React:

```bash
# From React project directory or terminal
curl -H "Origin: http://localhost:8081" \
     -H "Accept: application/json" \
     http://127.0.0.1:8000/api/plant-species
```

Expected: JSON response with plant species data (empty array initially)

---

**Your Laravel backend is ready to connect with React on port 8081!** 🚀

