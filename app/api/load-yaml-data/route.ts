import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

// Define the structure of the parsed data
type ParsedItem = {
  name: string;
  url: string;
  description: string;
  subcategory?: string;
};

type CategoryData = {
  [category: string]: {
    name: string;
    items: ParsedItem[];
  }[];
};

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    const yamlFiles = files.filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

    const data: CategoryData = {};

    for (const file of yamlFiles) {
      const filePath = path.join(dataDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const parsedData = yaml.load(fileContent) as ParsedItem[];

      // Ensure parsedData is an array
      if (!Array.isArray(parsedData)) {
        console.error(`Parsed data from ${file} is not an array:`, parsedData);
        continue;
      }

      const category = path.parse(file).name;

      // Group items by their subcategory
      const subCategories: { [key: string]: ParsedItem[] } = {};
      parsedData.forEach(item => {
        const subCategory = item.subcategory || '默认';
        if (!subCategories[subCategory]) {
          subCategories[subCategory] = [];
        }
        subCategories[subCategory].push({
          name: item.name,
          url: item.url,
          description: item.description
        });
      });

      // Convert to array of subcategories
      data[category] = Object.entries(subCategories).map(([name, items]) => ({
        name,
        items
      }));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading YAML data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}