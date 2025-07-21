const fs = require('fs');
const path = require('path');

// Configuration
const replacements = [
    // Types and interfaces
    { from: /\bFestival\b/g, to: 'Event' },
    { from: /\bfestival\b/g, to: 'event' },
    { from: /\bFestivals\b/g, to: 'Events' },
    { from: /\bfestivals\b/g, to:'events' },
    { from: /\bFESTIVAL\b/g, to: 'EVENT' },
    
    // Specific types
    { from: /\bFestivalStatus\b/g, to: 'EventStatus' },
    { from: /\bFestivalRequest\b/g, to: 'EventRequest' },
    { from: /\bfestivalId\b/g, to: 'eventId' },
    { from: /\bfestivalName\b/g, to: 'eventName' },
    { from: /\bfestivalDescription\b/g, to: 'eventDescription' },
    
    // Hook names
    { from: /\buseFestivals\b/g, to: 'useEvents' },
    { from: /\buseFeaturedFestivals\b/g, to: 'useFeaturedEvents' },
    { from: /\buseUpcomingFestivals\b/g, to: 'useUpcomingEvents' },
    { from: /\buseFestival\b/g, to: 'useEvent' },
    { from: /\buseOrganizerFestivals\b/g, to: 'useOrganizerEvents' },
    { from: /\buseCreateFestival\b/g, to: 'useCreateEvent' },
    { from: /\buseUpdateFestival\b/g, to: 'useUpdateEvent' },
    { from: /\buseDeleteFestival\b/g, to: 'useDeleteEvent' },
    
    // API endpoints
    { from: /\/api\/events/g, to: '/api/events' },
    { from: /\/events/g, to: '/events' },
    { from: /\/register-event/g, to: '/register-event' },
    
    // Text content
    { from: /ArmEventHub/g, to: 'ArmEventHub' },
    { from: /Create Event/g, to: 'Create Event' },
    { from: /Register Event/g, to: 'Register Event' },
    { from: /'event'/g, to: "'event'" },
    { from: /"event"/g, to: '"event"' },
];

// File extensions to process
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.prisma', '.json', '.md'];

// Directories to skip
const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

function shouldProcessFile(filePath) {
    const ext = path.extname(filePath);
    return extensions.includes(ext) && !skipDirs.some(dir => filePath.includes(dir));
}

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        replacements.forEach(({ from, to }) => {
            const before = content;
            content = content.replace(from, to);
            if (content !== before) {
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !skipDirs.includes(item)) {
            processDirectory(fullPath);
        } else if (stat.isFile() && shouldProcessFile(fullPath)) {
            processFile(fullPath);
        }
    });
}

// Start processing
console.log('Starting Event -> Event rename process...');
const rootDir = process.cwd();
processDirectory(rootDir);
console.log('Rename process completed!');

// Additional file/directory renames would need to be done manually or with additional scripts
console.log('\nManual steps remaining:');
console.log('1. Run database migration to update schema');
console.log('2. Update any remaining file/directory names');
console.log('3. Test the application thoroughly');