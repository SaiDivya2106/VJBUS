/**
 * Navbar animations for the horizontal selector
 * This script manages the animations for the horizontal selector in the navbar
 */

// Initialize the horizontal selector on page load
export function initializeSelector(selectorRef, activeRef, navbarRef) {
  if (!selectorRef.current || !activeRef.current || !navbarRef.current) return;
  
  const activeItem = activeRef.current;
  const selector = selectorRef.current;
  const navbar = navbarRef.current;
  
  // Get positions
  const itemPos = activeItem.getBoundingClientRect();
  const navbarPos = navbar.getBoundingClientRect();
  
  // Set initial position for the selector
  selector.style.left = `${itemPos.left - navbarPos.left}px`;
  selector.style.width = `${itemPos.width}px`;
}

// Update selector position when the active item changes
export function updateSelector(selectorRef, activeRef, navbarRef) {
  if (!selectorRef.current || !activeRef.current || !navbarRef.current) return;
  
  const activeItem = activeRef.current;
  const selector = selectorRef.current;
  const navbar = navbarRef.current;
  
  // Get updated positions
  const itemPos = activeItem.getBoundingClientRect();
  const navbarPos = navbar.getBoundingClientRect();
  
  // Animate the selector to the new position
  selector.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  selector.style.left = `${itemPos.left - navbarPos.left}px`;
  selector.style.width = `${itemPos.width}px`;
}

// Handle responsive changes for the selector
export function handleResponsiveSelector(selectorRef, activeRef, navbarRef, isMobile) {
  if (isMobile) {
    // Hide the selector on mobile
    if (selectorRef.current) {
      selectorRef.current.style.display = 'none';
    }
  } else {
    // Show and position the selector on desktop
    if (selectorRef.current) {
      selectorRef.current.style.display = 'inline-block';
      updateSelector(selectorRef, activeRef, navbarRef);
    }
  }
}

// Add event listeners for handling window resize
export function addResizeListener(callback) {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
} 