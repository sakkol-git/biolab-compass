# Quick Start: Connect React to Laravel API

## ✅ Backend Configuration Complete

Your Laravel backend is **ready** to accept requests from React on `http://localhost:8081`

### Verified Configuration
- ✅ CORS enabled for `http://localhost:8081`
- ✅ Credentials support enabled
- ✅ Sanctum stateful domains configured
- ✅ API endpoints working

---

## React Setup (Copy-Paste Ready)

### 1. Install Axios

```bash
npm install axios
```

### 2. Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getCsrfCookie = async () => {
  await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    withCredentials: true,
  });
};

export default api;
```

### 3. Create Plant Species Service

Create `src/services/plantSpecies.js`:

```javascript
import api, { getCsrfCookie } from './api';

export const plantSpeciesService = {
  // Get all plant species (paginated)
  getAll: async (page = 1) => {
    const response = await api.get(`/plant-species?page=${page}`);
    return response.data;
  },

  // Search plant species
  search: async (searchTerm) => {
    const response = await api.get(`/plant-species?search=${searchTerm}`);
    return response.data;
  },

  // Get single plant species
  getById: async (id) => {
    const response = await api.get(`/plant-species/${id}`);
    return response.data;
  },

  // Create new plant species
  create: async (data) => {
    await getCsrfCookie();
    const response = await api.post('/plant-species', data);
    return response.data;
  },

  // Update plant species
  update: async (id, data) => {
    await getCsrfCookie();
    const response = await api.put(`/plant-species/${id}`, data);
    return response.data;
  },

  // Delete plant species
  delete: async (id) => {
    await getCsrfCookie();
    const response = await api.delete(`/plant-species/${id}`);
    return response.data;
  },
};
```

### 4. Example React Component

Create `src/components/PlantSpeciesList.jsx`:

```jsx
import React, { useEffect, useState } from 'react';
import { plantSpeciesService } from '../services/plantSpecies';

function PlantSpeciesList() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    try {
      setLoading(true);
      const result = await plantSpeciesService.getAll();
      setSpecies(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading species:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadSpecies();
      return;
    }

    try {
      setLoading(true);
      const result = await plantSpeciesService.search(searchTerm);
      setSpecies(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this species?')) {
      return;
    }

    try {
      await plantSpeciesService.delete(id);
      setSpecies(species.filter(s => s.id !== id));
    } catch (err) {
      alert('Error deleting species: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="plant-species-list">
      <h1>Plant Species</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={loadSpecies} style={{ marginLeft: '5px' }}>
          Clear
        </button>
      </form>

      {species.length === 0 ? (
        <p>No plant species found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Common Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Scientific Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Family</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Growth Type</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {species.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{item.common_name}</td>
                <td style={{ padding: '10px' }}><em>{item.scientific_name}</em></td>
                <td style={{ padding: '10px' }}>{item.family || '-'}</td>
                <td style={{ padding: '10px' }}>{item.growth_type || '-'}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlantSpeciesList;
```

### 5. Use in Your App

Update `src/App.js`:

```jsx
import PlantSpeciesList from './components/PlantSpeciesList';

function App() {
  return (
    <div className="App">
      <PlantSpeciesList />
    </div>
  );
}

export default App;
```

---

## Test It Now!

### 1. Start Backend (Terminal 1)
```bash
cd /home/sakkol/Documents/Plant-Lap-Laboratory
php artisan serve
```

### 2. Start React (Terminal 2)
```bash
cd your-react-app
npm start
# or
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:8081`

You should see the plant species list (currently showing the Tomato entry from test data).

---

## API Data Format

### Plant Species Object

```typescript
{
  id: number;
  common_name: string;
  khmer_name?: string | null;
  scientific_name: string;
  family?: string | null;
  growth_type?: 'annual' | 'perennial' | 'biennial' | null;
  native_region?: string | null;
  propagation_method?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
```

### Create/Update Payload

```javascript
{
  common_name: "Tomato",           // required
  scientific_name: "Solanum lycopersicum",  // required, unique
  khmer_name: "ប៉េងប៉ោះ",         // optional
  family: "Solanaceae",            // optional
  growth_type: "annual",           // optional: 'annual', 'perennial', 'biennial'
  native_region: "South America",  // optional
  propagation_method: "Seeds",     // optional
  description: "...",              // optional
  image_url: "https://...",        // optional
}
```

---

## Troubleshooting

### "Network Error" or "CORS Error"

1. **Check backend is running:**
   ```bash
   curl http://127.0.0.1:8000/api/plant-species
   ```

2. **Check React is on port 8081:**
   - Look at terminal output when running `npm start`
   - Should say "Local: http://localhost:8081"

3. **Clear Laravel config:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### "401 Unauthorized" for POST/PUT/DELETE

Make sure you're calling `getCsrfCookie()` before authenticated requests:

```javascript
await getCsrfCookie();
await api.post('/plant-species', data);
```

### Empty Response or No Data

The database might be empty. Add test data:

```bash
# In Laravel backend terminal
php artisan tinker
```

Then in tinker:
```php
\App\Models\PlantSpecies::create([
    'common_name' => 'Tomato',
    'scientific_name' => 'Solanum lycopersicum',
    'family' => 'Solanaceae',
    'growth_type' => 'annual'
]);
```

---

## Current Test Data

Your backend already has one test record:

```json
{
  "id": 1,
  "common_name": "Tomato",
  "khmer_name": "ប៉េងប៉ោះ",
  "scientific_name": "Solanum lycopersicum",
  "family": "Solanaceae",
  "growth_type": "annual",
  "native_region": "South America",
  "propagation_method": "Seeds",
  "description": "A popular garden vegetable"
}
```

---

## ✅ Ready to Go!

Your backend is configured and tested. Just:
1. Copy the code above into your React project
2. Start both servers
3. Open `http://localhost:8081`

**Everything is ready for integration!** 🎉

For more details, see: [REACT_INTEGRATION_GUIDE.md](REACT_INTEGRATION_GUIDE.md)

