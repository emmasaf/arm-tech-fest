#!/bin/bash

# This script renames all occurrences of "festival" to "event" throughout the codebase
# It handles various cases and plurals

echo "Starting rename process from Festival to Event..."

# Create backup
echo "Creating backup..."
cp -r . ../arm-tech-fest-backup-$(date +%Y%m%d_%H%M%S)

# Function to perform case-sensitive replacements
replace_in_files() {
    local search=$1
    local replace=$2
    local file_pattern=$3
    
    echo "Replacing '$search' with '$replace' in $file_pattern files..."
    
    # Use find and sed for replacement
    find . -type f -name "$file_pattern" \
        -not -path "./node_modules/*" \
        -not -path "./.git/*" \
        -not -path "./.next/*" \
        -not -path "./dist/*" \
        -not -path "./build/*" \
        -not -path "./rename-festival-to-event.sh" \
        -exec sed -i '' "s/$search/$replace/g" {} \;
}

# Replace in TypeScript/JavaScript files
echo "Processing TypeScript/JavaScript files..."
replace_in_files "Festival" "Event" "*.ts"
replace_in_files "Festival" "Event" "*.tsx"
replace_in_files "Festival" "Event" "*.js"
replace_in_files "Festival" "Event" "*.jsx"

replace_in_files "festival" "event" "*.ts"
replace_in_files "festival" "event" "*.tsx"
replace_in_files "festival" "event" "*.js"
replace_in_files "festival" "event" "*.jsx"

replace_in_files "Festivals" "Events" "*.ts"
replace_in_files "Festivals" "Events" "*.tsx"
replace_in_files "Festivals" "Events" "*.js"
replace_in_files "Festivals" "Events" "*.jsx"

replace_in_files "festivals" "events" "*.ts"
replace_in_files "festivals" "events" "*.tsx"
replace_in_files "festivals" "events" "*.js"
replace_in_files "festivals" "events" "*.jsx"

replace_in_files "FESTIVAL" "EVENT" "*.ts"
replace_in_files "FESTIVAL" "EVENT" "*.tsx"
replace_in_files "FESTIVAL" "EVENT" "*.js"
replace_in_files "FESTIVAL" "EVENT" "*.jsx"

# Replace in Prisma schema
echo "Processing Prisma schema..."
replace_in_files "Festival" "Event" "*.prisma"
replace_in_files "festival" "event" "*.prisma"
replace_in_files "FestivalStatus" "EventStatus" "*.prisma"
replace_in_files "FestivalRequest" "EventRequest" "*.prisma"

# Replace in SQL files if any
echo "Processing SQL files..."
replace_in_files "festival" "event" "*.sql"
replace_in_files "Festival" "Event" "*.sql"

# Replace in JSON files
echo "Processing JSON files..."
replace_in_files "festival" "event" "*.json"
replace_in_files "Festival" "Event" "*.json"

# Replace in Markdown files
echo "Processing Markdown files..."
replace_in_files "festival" "event" "*.md"
replace_in_files "Festival" "Event" "*.md"

# Rename files and directories
echo "Renaming files and directories..."

# Rename directories first (deepest first to avoid conflicts)
find . -type d -name "*festival*" -not -path "./node_modules/*" -not -path "./.git/*" | sort -r | while read dir; do
    newdir=$(echo "$dir" | sed 's/festival/event/g')
    if [ "$dir" != "$newdir" ]; then
        echo "Renaming directory: $dir -> $newdir"
        mv "$dir" "$newdir"
    fi
done

find . -type d -name "*Festival*" -not -path "./node_modules/*" -not -path "./.git/*" | sort -r | while read dir; do
    newdir=$(echo "$dir" | sed 's/Festival/Event/g')
    if [ "$dir" != "$newdir" ]; then
        echo "Renaming directory: $dir -> $newdir"
        mv "$dir" "$newdir"
    fi
done

# Rename files
find . -type f -name "*festival*" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    newfile=$(echo "$file" | sed 's/festival/event/g')
    if [ "$file" != "$newfile" ]; then
        echo "Renaming file: $file -> $newfile"
        mv "$file" "$newfile"
    fi
done

find . -type f -name "*Festival*" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    newfile=$(echo "$file" | sed 's/Festival/Event/g')
    if [ "$file" != "$newfile" ]; then
        echo "Renaming file: $file -> $newfile"
        mv "$file" "$newfile"
    fi
done

echo "Rename process completed!"
echo "Note: You will need to:"
echo "1. Run 'bun install' to update dependencies"
echo "2. Run 'bun db:generate' to generate new Prisma client"
echo "3. Run 'bun db:migrate' to update the database schema"
echo "4. Update any external references or URLs"
echo "5. Test the application thoroughly"