const CONFIG = {
    GOOGLE_API_KEY: 'AIzaSyAv0eINGFdlMmMdCB-JsgyJ7C1uDHYMNhQ',
    GOOGLE_SEARCH_ENGINE_ID: 'c1415a5bba2664a8c' // Replace with your search engine ID
};

const Search = async (query) => {
    const numImages = 10; // Set the number of images to retrieve
    const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_API_KEY}&cx=${CONFIG.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Extract image URLs from the response
        const imageUrls = data.items.map(item => item.link);
        return imageUrls;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

export default Search;
