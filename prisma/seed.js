import { PrismaClient } from '@prisma/client'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { fileURLToPath } from 'url'
import path from 'path'

const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const parseInteger = (value) => {
  if (!value) return null
  const num = parseInt(value.toString().replace(/[^0-9]/g, ''))
  return isNaN(num) ? null : num
}

const run = async () => {
  console.log('Seeding Pokemon...')

  const records = []

  await new Promise((resolve, reject) => {
    createReadStream(path.join(__dirname, 'data/pokemonDB_dataset.csv'))
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => records.push(row))
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`Found ${records.length} records`)

  for (const row of records) {
    try {
      await prisma.pokemon.upsert({
        where: { name: row['Pokemon'] },
        update: {},
        create: {
          name: row['Pokemon'],
          type1: row['Type']?.split(',')[0]?.trim() || 'Unknown',
          type2: row['Type']?.split(',')[1]?.trim() || null,
          species: row['Species'] || null,
          height: row['Height'] || null,
          weight: row['Weight'] || null,
          abilities: row['Abilities'] || null,
          hp: parseInteger(row['HP Base']),
          attack: parseInteger(row['Attack Base']),
          defense: parseInteger(row['Defense Base']),
          spAttack: parseInteger(row['Special Attack Base']),
          spDefense: parseInteger(row['Special Defense Base']),
          speed: parseInteger(row['Speed Base']),
          catchRate: parseInteger(row['Catch Rate']),
          baseExp: parseInteger(row['Base Exp']),
          growthRate: row['Growth Rate'] || null,
          eggGroups: row['Egg Groups'] || null,
          gender: row['Gender'] || null,
        }
      })
    } catch (err) {
      console.error(`Skipping ${row['Pokemon']}:`, err.message)
    }
  }

  console.log('Seeding complete!')
  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})