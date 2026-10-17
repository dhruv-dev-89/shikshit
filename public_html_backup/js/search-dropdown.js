document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('scholarship-dropdown');
    
    if (!searchInput || !dropdown) {
        console.error('Search input or dropdown elements not found');
        return;
    }

    const dropdownItems = dropdown.getElementsByTagName('a');

    // Function to show dropdown
    function showDropdown() {
        dropdown.style.display = 'block';
        dropdown.classList.remove('hidden');
    }

    // Function to hide dropdown
    function hideDropdown() {
        dropdown.style.display = 'none';
        dropdown.classList.add('hidden');
    }

    // Function to filter dropdown items
    function filterDropdown(searchText) {
        searchText = searchText.toLowerCase();
        let hasVisibleItems = false;
        
        Array.from(dropdownItems).forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchText) || searchText === '') {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        if (hasVisibleItems) {
            showDropdown();
        } else if (searchText === '') {
            showDropdown();
        }
    }

    // Show dropdown on focus
    searchInput.addEventListener('focus', () => {
        showDropdown();
    });

    // Show/filter dropdown while typing
    searchInput.addEventListener('input', (e) => {
        filterDropdown(e.target.value);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown();
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideDropdown();
        }
    });

    // Initial setup
    hideDropdown();
});
