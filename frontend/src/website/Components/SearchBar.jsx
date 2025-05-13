import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../../Context';
import { useContext } from 'react';

function SearchBar() {
  const { API_BASE_URL, PRODUCT_URL } = useContext(MainContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${PRODUCT_URL}?search=${searchTerm}`);
        const data = await response.json();
        
        if (data.status === 1) {
          setSearchResults(data.product);
          setShowResults(true);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, API_BASE_URL, PRODUCT_URL]);

  const handleProductClick = (productId) => {
    setShowResults(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={`${API_BASE_URL}${PRODUCT_URL}/${product.thumbnail}`}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">₹{product.finalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar; 