import { nanoid } from 'nanoid';
import { db } from './database';
import { storeImage } from '@/services/imageService';
import type { Recipe, Ingredient, RecipeStep, MealCategory } from '@/types/recipe';

// Map recipe titles to their seed image filenames
const SEED_IMAGES: Record<string, string> = {
  'Chickpea Tzatziki Salad': 'chickpea-tzatziki.png',
  'French Style Peas': 'french-peas.png',
  'One-Pot Lemon Chicken and Rice': 'lemon-chicken-rice.png',
  'Caramelized Brussels Sprouts with Lemon': 'brussels-sprouts.png',
  'Orecchiette with Sausage and Broccoli Rabe': 'orecchiette-sausage.png',
  'Shrimp Ceviche': 'shrimp-ceviche.png',
  'Beef Bourguignon': 'beef-bourguignon.png',
  'Zuppa Toscana': 'zuppa-toscana.png',
  'Shrimp Scampi': 'shrimp-scampi.png',
  'Aglio e Olio': 'aglio-e-olio.png',
  'Carne Guisada': 'carne-guisada.png',
};

function ing(
  text: string,
  name: string,
  quantity: number,
  unit: Ingredient['unit'],
  opts?: Partial<Ingredient>
): Ingredient {
  return {
    id: nanoid(),
    originalText: text,
    name,
    quantity,
    unit,
    ...opts,
  };
}

function step(order: number, instruction: string, durationMinutes?: number): RecipeStep {
  return { order, instruction, durationMinutes };
}

function recipe(
  title: string,
  category: MealCategory,
  prepTimeMinutes: number,
  cookTimeMinutes: number,
  servings: number,
  ingredients: Ingredient[],
  steps: RecipeStep[],
  opts?: Partial<Recipe>
): Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title,
    category,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    ingredients,
    steps,
    tags: [],
    ...opts,
  };
}

const SEED_RECIPES: Array<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>> = [
  // 1. Chickpea Tzatziki Salad
  recipe(
    'Chickpea Tzatziki Salad',
    'dinner',
    15, 0, 4,
    [
      ing('1 cup Greek yogurt', 'Greek yogurt', 1, 'cup', { category: 'dairy' }),
      ing('1 garlic clove, grated', 'garlic', 1, 'clove', { preparation: 'grated', category: 'produce' }),
      ing('2 tablespoons olive oil, plus more for serving', 'olive oil', 2, 'tbsp', { category: 'condiments' }),
      ing('2 teaspoons honey', 'honey', 2, 'tsp', { category: 'condiments' }),
      ing('1 lemon', 'lemon', 1, 'whole', { category: 'produce' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('1 pound Persian cucumbers, halved and cut into 1/2-inch pieces', 'Persian cucumbers', 1, 'lb', { preparation: 'halved and cut into 1/2-inch pieces', category: 'produce' }),
      ing('2 (15-ounce) cans chickpeas, drained', 'chickpeas', 2, 'can', { preparation: 'drained', category: 'canned' }),
      ing('Big handful dill, chopped', 'dill', 1, 'bunch', { preparation: 'chopped', category: 'produce' }),
      ing('Big handful mint leaves, chopped', 'mint leaves', 1, 'bunch', { preparation: 'chopped', category: 'produce' }),
      ing('2 scallions, thinly sliced', 'scallions', 2, 'whole', { preparation: 'thinly sliced', category: 'produce' }),
    ],
    [
      step(1, 'To a large bowl, add the yogurt, garlic, olive oil, honey and the juice of half a lemon; whisk to combine. If it seems too thick, loosen it up with a splash of water or more lemon juice. Season well with salt and pepper.'),
      step(2, 'To the yogurt, add the cucumbers, chickpeas, dill, mint and scallions, and squeeze the remaining half lemon over the mixture. Toss to coat. Taste and season well with salt and pepper.'),
      step(3, 'To serve, drizzle with additional olive oil.'),
    ],
    {
      tags: ['quick', 'healthy', 'no-cook'],
      source: 'https://cooking.nytimes.com/recipes/1025698-tzatziki-chickpea-salad',
      description: 'A refreshing, creamy chickpea salad with yogurt, cucumber, and fresh herbs.',
    }
  ),

  // 2. French Style Peas
  recipe(
    'French Style Peas',
    'side',
    15, 25, 4,
    [
      ing('500g frozen peas, defrosted', 'frozen peas', 500, 'g', { preparation: 'defrosted', category: 'frozen' }),
      ing('2 Italian white onions, diced pea-size', 'white onions', 2, 'whole', { preparation: 'diced pea-size', category: 'produce' }),
      ing('2 heads gem lettuce, washed and finely cut', 'gem lettuce', 2, 'whole', { preparation: 'washed and finely cut', category: 'produce' }),
      ing('50g diced ventreche bacon, rind removed', 'ventreche bacon', 50, 'g', { preparation: 'diced, rind removed', category: 'meat' }),
      ing('1 liter white chicken stock', 'chicken stock', 1, 'l', { category: 'canned' }),
      ing('100g frozen silverskin onions, defrosted', 'silverskin onions', 100, 'g', { preparation: 'defrosted', category: 'frozen' }),
      ing('Finely chopped parsley', 'parsley', 0, 'to_taste', { preparation: 'finely chopped', category: 'produce' }),
      ing('Beurre manie (equal soft butter and kneaded flour)', 'butter', 2, 'tbsp', { category: 'dairy' }),
      ing('Flour for beurre manie', 'flour', 2, 'tbsp', { category: 'grains' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
    ],
    [
      step(1, 'Render smoked bacon in a hot pan, allow the fat to be drawn out slowly turning down the heat.', 5),
      step(2, 'Add the diced onion and season with salt and pepper. Add some butter and allow to cook to soften for around 5-10 minutes.', 10),
      step(3, 'Add the peas and pearl onions and cover with the chicken stock. Bring to a simmer.'),
      step(4, 'Make a beurre manie by kneading equal parts soft butter and flour together. Add to the pot and stir in.'),
      step(5, 'Cover with a cartouche (parchment paper lid) and bake in a 180°C (350°F) oven for 20-25 minutes.', 25),
    ],
    {
      tags: ['french', 'classic', 'side-dish'],
      description: 'Classic French braised peas with bacon, pearl onions, and lettuce in a velvety stock.',
      notes: 'The beurre manie can be made with ham, duck, or chicken fat instead of butter for variation.',
    }
  ),

  // 3. One-Pot Lemon Chicken and Rice
  recipe(
    'One-Pot Lemon Chicken and Rice',
    'dinner',
    15, 40, 4,
    [
      ing('4 bone-in, skin-on chicken thighs (about 1.5 lbs)', 'chicken thighs', 4, 'piece', { preparation: 'bone-in, skin-on', category: 'meat' }),
      ing('Salt and black pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('2 teaspoons dried oregano', 'dried oregano', 2, 'tsp', { category: 'spices' }),
      ing('Crushed red pepper', 'crushed red pepper', 0, 'to_taste', { category: 'spices' }),
      ing('2 tablespoons extra-virgin olive oil', 'olive oil', 2, 'tbsp', { category: 'condiments' }),
      ing('2 lemons', 'lemons', 2, 'whole', { category: 'produce' }),
      ing('1 cup pitted Castelvetrano or kalamata olives, smashed and roughly chopped', 'olives', 1, 'cup', { preparation: 'pitted, smashed and roughly chopped', category: 'canned' }),
      ing('6 garlic cloves, minced', 'garlic', 6, 'clove', { preparation: 'minced', category: 'produce' }),
      ing('1 medium shallot or half medium onion, minced', 'shallot', 1, 'whole', { preparation: 'minced', category: 'produce' }),
      ing('2 cups long-grain white rice, rinsed', 'long-grain white rice', 2, 'cup', { preparation: 'rinsed', category: 'grains' }),
      ing('4 cups chicken broth', 'chicken broth', 4, 'cup', { category: 'canned' }),
      ing('1/4 cup roughly chopped fresh parsley', 'fresh parsley', 0.25, 'cup', { preparation: 'roughly chopped', category: 'produce' }),
    ],
    [
      step(1, 'Heat the oven to 400°F. Pat the chicken thighs dry. Season with 1 tsp each salt, pepper and dried oregano and a pinch of crushed red pepper.'),
      step(2, 'Place a large Dutch oven over medium-high heat, add oil. Add thighs skin side down and cook undisturbed until they self-release, about 5 minutes. Remove and set aside.', 5),
      step(3, 'Cut 1 lemon into 1/4-inch slices. Add to the pot and cook until caramelized and softened, about 2 minutes. Remove and set aside.', 2),
      step(4, 'Add the olives, garlic, shallot and 1 tsp each salt, pepper and dried oregano. Cook over medium-low, scraping browned bits, until garlic is fragrant, 2-3 minutes.', 3),
      step(5, 'Turn heat to high, add the rice and broth, stir to combine and cover until it comes to a boil, about 5 minutes.', 5),
      step(6, 'Remove from heat, place chicken thighs on top skin side up, cover with lemon slices. Place pot covered into the oven and bake until rice and chicken are fully cooked, 25-30 minutes.', 30),
      step(7, 'Serve topped with fresh parsley and a squeeze of lemon juice.'),
    ],
    {
      tags: ['one-pot', 'weeknight', 'comfort-food'],
      source: 'https://cooking.nytimes.com/recipes/1025436-one-pot-chicken-and-rice-with-caramelized-lemon',
      description: 'Crispy chicken thighs nestled on lemony rice with olives and garlic, all in one pot.',
    }
  ),

  // 4. Caramelized Brussels Sprouts with Lemon
  recipe(
    'Caramelized Brussels Sprouts with Lemon',
    'side',
    20, 45, 8,
    [
      ing('2 pounds brussels sprouts, bottoms trimmed only very slightly', 'brussels sprouts', 2, 'lb', { preparation: 'bottoms trimmed', category: 'produce' }),
      ing('4 tablespoons olive oil', 'olive oil', 4, 'tbsp', { category: 'condiments' }),
      ing('Salt and freshly ground black pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('1 lemon', 'lemon', 1, 'whole', { category: 'produce' }),
    ],
    [
      step(1, 'Heat oven to 350°F. Shave off thin layers from the bottom of each sprout, pulling off darker outer leaves into a bowl, until you have just the tight light-green core. Slice any very large cores in half.', 15),
      step(2, 'Combine the cores and 2 tbsp oil on a rimmed baking sheet, season with salt and pepper. Toss, arrange cut pieces cut-side down, and roast, shaking once or twice, until a knife slides into cores with just a little resistance, 30-35 minutes.', 35),
      step(3, 'Remove baking sheet and increase oven to 425°F. Add remaining 2 tbsp oil to the bowl of leaves, season with salt and pepper, toss until coated. Scatter leaves over the baking sheet.', 2),
      step(4, 'Return to oven and roast until leaves are bright green and crispy and cores are caramelized, 10-15 minutes.', 15),
      step(5, 'Let cool slightly. Finely grate about half the lemon zest over the sprouts. Just before serving, squeeze half the lemon over the sheet. Season to taste and serve immediately.'),
    ],
    {
      tags: ['vegetables', 'holiday', 'crispy'],
      source: 'https://cooking.nytimes.com/recipes/1024796-caramelized-brussels-sprouts-with-lemon',
      description: 'Deeply caramelized sprout cores with shatteringly crispy outer leaves, finished with lemon.',
      notes: 'Leaves can be separated from cores 1 day ahead. Store separately in the fridge. Leftovers keep 2 days in the fridge.',
    }
  ),

  // 5. Orecchiette with Sausage and Broccoli Rabe
  recipe(
    'Orecchiette with Sausage and Broccoli Rabe',
    'dinner',
    10, 25, 4,
    [
      ing('1 lb orecchiette pasta', 'orecchiette pasta', 1, 'lb', { category: 'grains' }),
      ing('1 lb Italian sausage, casings removed', 'Italian sausage', 1, 'lb', { preparation: 'casings removed', category: 'meat' }),
      ing('1 bunch broccoli rabe, trimmed and cut into 2-inch pieces', 'broccoli rabe', 1, 'bunch', { preparation: 'trimmed and cut into 2-inch pieces', category: 'produce' }),
      ing('4 garlic cloves, thinly sliced', 'garlic', 4, 'clove', { preparation: 'thinly sliced', category: 'produce' }),
      ing('1/2 tsp crushed red pepper flakes', 'red pepper flakes', 0.5, 'tsp', { category: 'spices' }),
      ing('3 tablespoons olive oil', 'olive oil', 3, 'tbsp', { category: 'condiments' }),
      ing('1/2 cup Pecorino Romano, grated', 'Pecorino Romano', 0.5, 'cup', { preparation: 'grated', category: 'dairy' }),
      ing('Salt', 'salt', 0, 'to_taste', { category: 'spices' }),
      ing('Reserved pasta water', 'pasta water', 0.5, 'cup', { category: 'other' }),
    ],
    [
      step(1, 'Bring a large pot of salted water to a boil. Add broccoli rabe and blanch for 2 minutes. Remove with a slotted spoon and set aside. Add orecchiette to the same water and cook until al dente.', 12),
      step(2, 'Meanwhile, heat olive oil in a large skillet over medium-high heat. Add sausage and break into small pieces. Cook until browned and cooked through, about 6-8 minutes.', 8),
      step(3, 'Add garlic and red pepper flakes to the sausage and cook until fragrant, about 1 minute.', 1),
      step(4, 'Add the blanched broccoli rabe to the skillet and toss to combine. Season with salt.', 2),
      step(5, 'Drain pasta, reserving 1/2 cup pasta water. Add pasta to the skillet, toss everything together, adding pasta water as needed to create a light sauce. Finish with grated Pecorino Romano.'),
    ],
    {
      tags: ['italian', 'pasta', 'weeknight'],
      description: 'A classic Southern Italian pasta with crumbled sausage, bitter broccoli rabe, and sharp Pecorino.',
    }
  ),

  // 6. Shrimp Ceviche
  recipe(
    'Shrimp Ceviche',
    'appetizer',
    25, 5, 6,
    [
      ing('1 lb shrimp, peeled and deveined', 'shrimp', 1, 'lb', { preparation: 'peeled, deveined, and chopped', category: 'seafood' }),
      ing('1 cup fresh lime juice (about 8 limes)', 'lime juice', 1, 'cup', { category: 'produce' }),
      ing('1/2 cup fresh lemon juice', 'lemon juice', 0.5, 'cup', { category: 'produce' }),
      ing('1 cup diced tomato', 'tomato', 1, 'cup', { preparation: 'diced', category: 'produce' }),
      ing('1/2 cup diced red onion', 'red onion', 0.5, 'cup', { preparation: 'diced', category: 'produce' }),
      ing('1 jalapeno, seeded and minced', 'jalapeno', 1, 'whole', { preparation: 'seeded and minced', category: 'produce' }),
      ing('1/2 cup chopped fresh cilantro', 'cilantro', 0.5, 'cup', { preparation: 'chopped', category: 'produce' }),
      ing('1 avocado, diced', 'avocado', 1, 'whole', { preparation: 'diced', category: 'produce' }),
      ing('1 cucumber, peeled and diced', 'cucumber', 1, 'whole', { preparation: 'peeled and diced', category: 'produce' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('Tortilla chips, for serving', 'tortilla chips', 0, 'to_taste', { category: 'snacks', optional: true }),
    ],
    [
      step(1, 'Bring a pot of salted water to a boil. Add shrimp and cook until just pink, about 2-3 minutes. Drain and immediately transfer to an ice bath. Once cool, chop into bite-size pieces.', 5),
      step(2, 'Combine chopped shrimp with lime juice and lemon juice in a bowl. Cover and refrigerate for at least 30 minutes.', 30),
      step(3, 'Add the tomato, red onion, jalapeno, cilantro, cucumber, and avocado. Toss gently to combine.'),
      step(4, 'Season with salt and pepper. Serve chilled with tortilla chips.'),
    ],
    {
      tags: ['seafood', 'light', 'summer', 'no-cook'],
      description: 'Bright and zesty shrimp ceviche with fresh vegetables, lime, and a touch of heat.',
      notes: 'Let the shrimp marinate in citrus for at least 30 minutes (up to 2 hours) for best flavor. Add avocado just before serving.',
    }
  ),

  // 7. Beef Bourguignon
  recipe(
    'Beef Bourguignon',
    'dinner',
    30, 180, 6,
    [
      ing('3 lbs beef chuck, cut into 2-inch cubes', 'beef chuck', 3, 'lb', { preparation: 'cut into 2-inch cubes', category: 'meat' }),
      ing('6 oz bacon, diced', 'bacon', 6, 'oz', { preparation: 'diced', category: 'meat' }),
      ing('1 bottle (750ml) dry red wine (Burgundy or Pinot Noir)', 'dry red wine', 1, 'whole', { category: 'beverages' }),
      ing('2 cups beef broth', 'beef broth', 2, 'cup', { category: 'canned' }),
      ing('2 tablespoons tomato paste', 'tomato paste', 2, 'tbsp', { category: 'canned' }),
      ing('3 tablespoons butter', 'butter', 3, 'tbsp', { category: 'dairy' }),
      ing('3 tablespoons flour', 'flour', 3, 'tbsp', { category: 'grains' }),
      ing('3 tablespoons olive oil', 'olive oil', 3, 'tbsp', { category: 'condiments' }),
      ing('1 lb pearl onions, peeled', 'pearl onions', 1, 'lb', { preparation: 'peeled', category: 'produce' }),
      ing('1 lb cremini mushrooms, quartered', 'cremini mushrooms', 1, 'lb', { preparation: 'quartered', category: 'produce' }),
      ing('3 carrots, cut into 1-inch pieces', 'carrots', 3, 'whole', { preparation: 'cut into 1-inch pieces', category: 'produce' }),
      ing('3 garlic cloves, minced', 'garlic', 3, 'clove', { preparation: 'minced', category: 'produce' }),
      ing('1 tablespoon fresh thyme leaves', 'fresh thyme', 1, 'tbsp', { category: 'produce' }),
      ing('2 bay leaves', 'bay leaves', 2, 'whole', { category: 'spices' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('Fresh parsley for garnish', 'parsley', 0, 'to_taste', { preparation: 'chopped', category: 'produce' }),
    ],
    [
      step(1, 'Cook diced bacon in a Dutch oven until crispy. Remove and set aside. Pat beef dry, season with salt and pepper. Brown in batches in the bacon fat, about 3-4 minutes per side. Remove and set aside.', 20),
      step(2, 'Add carrots and pearl onions to the pot, cook until lightly browned, about 5 minutes. Add garlic and cook 1 minute more.', 6),
      step(3, 'Add tomato paste, stir and cook for 1 minute. Sprinkle flour over the vegetables and stir to coat.', 2),
      step(4, 'Pour in the wine and beef broth, scraping up any browned bits. Add thyme, bay leaves, bacon, and beef back to the pot. Bring to a simmer.'),
      step(5, 'Cover and transfer to a 325°F oven. Braise for 2-3 hours until the beef is fork-tender.', 150),
      step(6, 'During the last 30 minutes, sauté mushrooms in butter in a separate pan until golden, about 8 minutes. Add to the stew.', 8),
      step(7, 'Remove bay leaves. Taste and adjust seasoning. Serve garnished with fresh parsley.'),
    ],
    {
      tags: ['french', 'comfort-food', 'slow-cook', 'winter'],
      description: 'The classic French beef stew braised in red wine with mushrooms, pearl onions, and bacon.',
      notes: 'Even better the next day. Serve with crusty bread, egg noodles, or mashed potatoes.',
    }
  ),

  // 8. Zuppa Toscana
  recipe(
    'Zuppa Toscana',
    'dinner',
    15, 30, 6,
    [
      ing('1 lb Italian sausage (hot or mild)', 'Italian sausage', 1, 'lb', { category: 'meat' }),
      ing('6 slices bacon, chopped', 'bacon', 6, 'slice', { preparation: 'chopped', category: 'meat' }),
      ing('1 large onion, diced', 'onion', 1, 'whole', { preparation: 'diced', category: 'produce' }),
      ing('4 garlic cloves, minced', 'garlic', 4, 'clove', { preparation: 'minced', category: 'produce' }),
      ing('4 cups chicken broth', 'chicken broth', 4, 'cup', { category: 'canned' }),
      ing('2 cups water', 'water', 2, 'cup', { category: 'other' }),
      ing('1 lb Yukon Gold potatoes, sliced 1/4-inch thick', 'Yukon Gold potatoes', 1, 'lb', { preparation: 'sliced 1/4-inch thick', category: 'produce' }),
      ing('1 bunch kale, stems removed and roughly chopped', 'kale', 1, 'bunch', { preparation: 'stems removed, roughly chopped', category: 'produce' }),
      ing('1 cup heavy cream', 'heavy cream', 1, 'cup', { category: 'dairy' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('1/2 tsp crushed red pepper flakes', 'red pepper flakes', 0.5, 'tsp', { category: 'spices' }),
    ],
    [
      step(1, 'Brown the sausage in a large pot over medium-high heat, breaking it into crumbles. Remove and set aside.', 8),
      step(2, 'In the same pot, cook bacon until crispy. Remove and set aside, leaving the drippings.', 5),
      step(3, 'Add onion to the drippings and cook until softened, about 3 minutes. Add garlic and red pepper flakes, cook 1 minute more.', 4),
      step(4, 'Add chicken broth, water, and potatoes. Bring to a boil, then reduce to a simmer. Cook until potatoes are tender, about 15 minutes.', 15),
      step(5, 'Add the sausage, bacon, and kale. Simmer until kale is wilted, about 5 minutes.', 5),
      step(6, 'Stir in heavy cream. Season with salt and pepper. Serve hot.'),
    ],
    {
      tags: ['soup', 'italian', 'comfort-food', 'winter'],
      description: 'A hearty Tuscan soup with spicy sausage, potatoes, kale, and a creamy broth.',
    }
  ),

  // 9. Shrimp Scampi
  recipe(
    'Shrimp Scampi',
    'dinner',
    10, 15, 4,
    [
      ing('1 lb large shrimp, peeled and deveined', 'shrimp', 1, 'lb', { preparation: 'peeled and deveined', category: 'seafood' }),
      ing('12 oz linguine or spaghetti', 'linguine', 12, 'oz', { category: 'grains' }),
      ing('4 tablespoons butter', 'butter', 4, 'tbsp', { category: 'dairy' }),
      ing('3 tablespoons olive oil', 'olive oil', 3, 'tbsp', { category: 'condiments' }),
      ing('6 garlic cloves, thinly sliced', 'garlic', 6, 'clove', { preparation: 'thinly sliced', category: 'produce' }),
      ing('1/2 cup dry white wine', 'dry white wine', 0.5, 'cup', { category: 'beverages' }),
      ing('Juice of 1 lemon', 'lemon juice', 1, 'whole', { category: 'produce' }),
      ing('1/4 tsp crushed red pepper flakes', 'red pepper flakes', 0.25, 'tsp', { category: 'spices' }),
      ing('1/4 cup chopped fresh parsley', 'parsley', 0.25, 'cup', { preparation: 'chopped', category: 'produce' }),
      ing('Salt and pepper', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
    ],
    [
      step(1, 'Cook linguine in salted boiling water until al dente. Reserve 1 cup pasta water, then drain.', 10),
      step(2, 'While pasta cooks, heat olive oil and 2 tbsp butter in a large skillet over medium-high heat. Season shrimp with salt and pepper, add to skillet. Cook 1-2 minutes per side until pink. Remove and set aside.', 4),
      step(3, 'Reduce heat to medium. Add remaining 2 tbsp butter and garlic. Cook until fragrant, about 1 minute.', 1),
      step(4, 'Add white wine, lemon juice, and red pepper flakes. Simmer for 2 minutes, scraping up any browned bits.', 2),
      step(5, 'Add the cooked pasta and shrimp back to the skillet. Toss to coat, adding pasta water as needed. Finish with parsley. Serve immediately.'),
    ],
    {
      tags: ['italian', 'seafood', 'pasta', 'quick'],
      description: 'Succulent shrimp in a garlicky lemon-butter wine sauce tossed with linguine.',
    }
  ),

  // 10. Aglio e Olio
  recipe(
    'Aglio e Olio',
    'dinner',
    5, 15, 4,
    [
      ing('1 lb spaghetti', 'spaghetti', 1, 'lb', { category: 'grains' }),
      ing('1/2 cup extra-virgin olive oil', 'olive oil', 0.5, 'cup', { category: 'condiments' }),
      ing('8 garlic cloves, thinly sliced', 'garlic', 8, 'clove', { preparation: 'thinly sliced', category: 'produce' }),
      ing('1/2 tsp crushed red pepper flakes', 'red pepper flakes', 0.5, 'tsp', { category: 'spices' }),
      ing('1/3 cup chopped fresh parsley', 'parsley', 0.33, 'cup', { preparation: 'chopped', category: 'produce' }),
      ing('1/2 cup grated Parmigiano-Reggiano', 'Parmigiano-Reggiano', 0.5, 'cup', { preparation: 'grated', category: 'dairy', optional: true }),
      ing('Salt', 'salt', 0, 'to_taste', { category: 'spices' }),
    ],
    [
      step(1, 'Cook spaghetti in generously salted boiling water until just shy of al dente. Reserve 1 cup pasta water, then drain.', 10),
      step(2, 'While pasta cooks, heat olive oil in a large skillet over medium-low heat. Add garlic and red pepper flakes. Cook slowly, stirring occasionally, until garlic is golden (not brown), about 4-5 minutes.', 5),
      step(3, 'Add the drained pasta to the skillet along with 1/2 cup reserved pasta water. Toss vigorously over medium heat until the pasta is coated and the sauce is emulsified, about 2 minutes.', 2),
      step(4, 'Remove from heat, toss with parsley. Add more pasta water if needed. Serve with Parmigiano-Reggiano if desired.'),
    ],
    {
      tags: ['italian', 'pasta', 'quick', 'simple'],
      description: 'The simplest, most elegant pasta — golden garlic, olive oil, and a touch of heat.',
      notes: 'The key is to cook the garlic slowly until golden, never brown. The pasta water creates the silky sauce.',
    }
  ),

  // 11. Carne Guisada
  recipe(
    'Carne Guisada',
    'dinner',
    20, 120, 6,
    [
      ing('3 lbs cubed beef stew meat or chuck pot roast', 'beef stew meat', 3, 'lb', { preparation: 'cubed', category: 'meat' }),
      ing('Salt and black pepper to taste', 'salt and pepper', 0, 'to_taste', { category: 'spices' }),
      ing('1 onion', 'onion', 1, 'whole', { category: 'produce' }),
      ing('1 large green bell pepper', 'green bell pepper', 1, 'whole', { category: 'produce' }),
      ing('3 minced garlic cloves', 'garlic', 3, 'clove', { preparation: 'minced', category: 'produce' }),
      ing('4 Roma tomatoes', 'Roma tomatoes', 4, 'whole', { category: 'produce' }),
      ing('4 tbsp all-purpose flour', 'all-purpose flour', 4, 'tbsp', { category: 'grains' }),
      ing('4 tsp chili powder', 'chili powder', 4, 'tsp', { category: 'spices' }),
      ing('1 1/2 tsp ground cumin', 'ground cumin', 1.5, 'tsp', { category: 'spices' }),
      ing('1 tsp oregano', 'oregano', 1, 'tsp', { category: 'spices' }),
      ing('4 cups beef broth', 'beef broth', 4, 'cup', { category: 'canned' }),
      ing('2 tbsp tomato paste', 'tomato paste', 2, 'tbsp', { category: 'canned' }),
    ],
    [
      step(1, 'Season the cubed beef generously with salt and black pepper.'),
      step(2, 'In a large pot or Dutch oven over medium-high heat, brown the beef in batches. Remove and set aside.', 10),
      step(3, 'In the same pot, sauté the diced onion and green bell pepper until softened, about 5 minutes. Add the minced garlic and cook for 1 minute.', 6),
      step(4, 'Add the flour and stir to coat the vegetables. Cook for 1-2 minutes.', 2),
      step(5, 'Add the chili powder, cumin, and oregano. Stir to combine.'),
      step(6, 'Dice the Roma tomatoes and add them to the pot along with the tomato paste. Stir well.', 2),
      step(7, 'Pour in the beef broth and stir, scraping up any browned bits from the bottom. Return the beef to the pot.'),
      step(8, 'Bring to a boil, then reduce heat to low. Cover and simmer until the beef is fork-tender and the sauce has thickened, about 1.5 to 2 hours. Stir occasionally.', 105),
      step(9, 'Taste and adjust seasoning with salt and pepper. Serve with rice, tortillas, or beans.'),
    ],
    {
      tags: ['mexican', 'comfort-food', 'slow-cook', 'stew'],
      source: 'https://www.youtube.com/watch?v=Un2EzS1mIzQ',
      description: 'A classic Mexican beef stew braised low and slow with tomatoes, chili, and cumin until fork-tender.',
      notes: 'Serve with warm flour tortillas, rice, or beans. Even better the next day.',
    }
  ),
];

async function fetchAndStoreImage(filename: string): Promise<string | undefined> {
  try {
    const response = await fetch(`/seed-images/${filename}`);
    if (!response.ok) return undefined;
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type || 'image/png' });
    return await storeImage(file);
  } catch {
    console.warn(`Failed to load seed image: ${filename}`);
    return undefined;
  }
}

const SEED_VERSION = 5; // bump this to force a re-seed

export async function seedRecipes(): Promise<void> {
  const storedVersion = localStorage.getItem('housemenu_seed_version');
  if (storedVersion === String(SEED_VERSION)) return;

  // Clear old data and re-seed
  await db.recipes.clear();
  await db.recipeImages.clear();

  const now = Date.now();

  // Load all images in parallel
  const imageResults = await Promise.all(
    SEED_RECIPES.map(async (data) => {
      const filename = SEED_IMAGES[data.title];
      if (!filename) return undefined;
      return fetchAndStoreImage(filename);
    })
  );

  const recipes: Recipe[] = SEED_RECIPES.map((data, index) => ({
    ...data,
    id: nanoid(),
    imageId: imageResults[index],
    createdAt: now - index * 1000,
    updatedAt: now - index * 1000,
  }));

  await db.recipes.bulkAdd(recipes);
  localStorage.setItem('housemenu_seed_version', String(SEED_VERSION));
}
