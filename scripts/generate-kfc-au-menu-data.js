#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_SOURCE = "/Users/justinpagalilauan/Downloads/KFCAustraliaMenu-4-web-pickup.json";
const DEFAULT_TARGET = "/Users/justinpagalilauan/Desktop/Atlas UI Folder/kfc-au-menu-data.js";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function firstText(value) {
  if (Array.isArray(value)) {
    const match = value.find((entry) => entry && typeof entry.value === "string" && entry.value.trim());
    return match ? match.value.trim() : "";
  }
  return typeof value === "string" ? value.trim() : "";
}

function firstNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCurrency(value) {
  if (!Number.isFinite(value)) return null;
  return Number((value / 100).toFixed(2));
}

function getImageFromContent(content) {
  if (!content || typeof content !== "object") return "";
  return content.image?.mainImage || content.mainImage || "";
}

function chooseImage(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function titleCase(value) {
  return String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeLookupLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[®™^]/g, "")
    .replace(/['’]/g, "")
    .replace(/\bpc\b/g, "piece")
    .replace(/\bpcs\b/g, "pieces")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const liveModifierImageOverrides = new Map(Object.entries({
  "Cheese Slice": "https://images.ctfassets.net/crbk84xktnsl/65YVjpJ0l6ICtbk3PtnNAz/75b1c509de9f3e82db206ec6210b2d82/Modifier_Cheese_Slice.png?fit=fill&fm=webp",
  "Corn Chips": "https://images.ctfassets.net/crbk84xktnsl/21fl9F2d5YYaMgiRHFH1Hl/83a9e20f5d3c49252addf1937c34e4b7/Modifier_Corn_Chips.png?fit=fill&fm=webp",
  "Dipping Sauce": "https://images.ctfassets.net/crbk84xktnsl/RLMHlsQrPIe7tyFlxrRxm/143df961b5b8b411528591d3da26beaf/Sauce_Supercharged.png?fm=webp&fit=fill",
  "Dipping Sauces": "https://images.ctfassets.net/crbk84xktnsl/RLMHlsQrPIe7tyFlxrRxm/143df961b5b8b411528591d3da26beaf/Sauce_Supercharged.png?fm=webp&fit=fill",
  "Lettuce": "https://images.ctfassets.net/crbk84xktnsl/66hSImOHbH6vlmRxCkqv88/794acadf750c1784e171868e05779407/Modifier_Lettuce.png?fit=fill&fm=webp",
  "Mayo": "https://images.ctfassets.net/crbk84xktnsl/46SEeDBx51iTnkP6zPt82l/f3aaf2a729d86f1950cd6e2fe67aac72/Modifier_Sauce_Mayo.png?fit=fill&fm=webp",
  "BBQ Sauce": "https://images.ctfassets.net/crbk84xktnsl/1T7KFiAkbVunJylykaL4Dc/ddb50181024592e00a114a02e79ab543/Modifier_Sauce_BBQ.png?fit=fill&fm=webp",
  "Bacon Slice": "https://images.ctfassets.net/crbk84xktnsl/4N9PcITe1cjl2Gx7IrjIH9/754cce98c9f31c5d75fe9579ea244783/39_Add_On_Bacon.png?fm=webp&fit=fill",
  "Chilli Relish Sauce": "https://images.ctfassets.net/crbk84xktnsl/e1t8csgFvFDyc38Ou9YhA/0a58e6747e9f63a60769f614cfd1a638/Modifier_Sauce_Chilli_Relish.png?fit=fill&fm=webp",
  "Jalapeno Mayo": "https://images.ctfassets.net/crbk84xktnsl/25gG8FF9nZOIVKkGa9nnzK/9ac7d6f6bd2da025b40eb28f4506d228/Modifier_Sauce_Jalapeno_Mayo.png?fit=fill&fm=webp",
  "No Sauce": "https://images.ctfassets.net/crbk84xktnsl/JZdvAAL3roGhZI36oM9zw/f5936909b1a4ae5adae614096cf996e6/Original_Tender_5_No_Sauce.png",
  "4 PC Original Recipe": "https://images.ctfassets.net/crbk84xktnsl/YILY0VXWpCgDpYu6v8wND/98164eef851994b18f1351f25a71615e/Original_Recipe_4.png",
  "Pepper Mayo": "https://images.ctfassets.net/crbk84xktnsl/4PcYbCzHQ5lNsJA3RRH10d/2b459f168819a6e2cfec6eb2d9721e59/Modifier_Sauce_Pepper_Mayo.png?fit=fill&fm=webp",
  "Supercharged Sauce": "https://images.ctfassets.net/crbk84xktnsl/S7OMZwS6F04k6U2qUxeQh/aee02a208e220562bc367006951c47ab/Modifier_Sauce_Supercharged.png?fit=fill&fm=webp",
  "Tangy Tomato Sauce": "https://images.ctfassets.net/crbk84xktnsl/7zNDbrGrCUaJ83ewFXTwYE/a1d9f32d663cb01d0326066a852dddc1/J5518_23P07_Sauce_Tangy_Tomato.png?fit=fill&fm=webp"
}).map(([label, image]) => [normalizeLookupLabel(label), image]));

const modifierImageAliases = new Map(Object.entries({
  "1 Piece Original Crispy Fillet": "Original Crispy Fillet Piece",
  "1 Piece Original Tender": "Go Bucket® 1 Original Tender",
  "1 Piece Original Tender™": "Go Bucket® 1 Original Tender",
  "1 Piece Original Tenders™": "Go Bucket® 1 Original Tender",
  "1 Piece Zinger Fillet": "Zinger® Fillet Piece",
  "1 Piece Zinger® Fillet": "Zinger® Fillet Piece",
  "Zinger® Fillet": "Zinger® Fillet Piece",
  "1 Piece Original Recipe": "1 Piece of Chicken",
  "2 Pieces Original Recipe": "1 Piece of Chicken",
  "3 Pieces Original Recipe": "3 Pieces of Chicken",
  "4 Nuggets": "Kids Meal with Nuggets",
  "4 Original Tenders™": "5 Original Tenders™",
  "6 Original Tenders™": "5 Original Tenders™",
  "6 Pieces": "6 Pieces of Chicken",
  "8 Original Tenders™": "5 Original Tenders™",
  "10 PC Original Recipe": "1 Piece of Chicken",
  "15 PC Original Recipe": "1 Piece of Chicken",
  "18 Nuggets": "10 Nuggets",
  "1 Wicked Wing": "3 Wicked Wings®",
  "1 Wicked Boneless": "3 Pieces Wicked Boneless",
  "2 Wicked Boneless": "3 Pieces Wicked Boneless",
  "3 Wicked Boneless": "3 Pieces Wicked Boneless",
  "6 Wicked Boneless": "6 Pieces Wicked Boneless",
  "4 Dinner Rolls": "Dinner Roll",
  "2 Dipping Sauces": "Dipping Sauces",
  "3 Dipping Sauces": "Dipping Sauces",
  "Half Pepsi Freeze^": "Pepsi Freeze^",
  "Half Raspberry Freeze": "Raspberry Freeze",
  "Half Mountain Dew Freeze^": "Mountain Dew Freeze^",
  "Water 600mL": "Bottled Water",
  "No Salt": "Regular Chips",
  "Extra Salt": "Regular Chips",
  "Crunchy Slaw": "Crunchy Jalapeno Slaw",
  "Big Bro Burger": "Chris' Big Bro Combo",
  "Supercharged Power Slider": "Original Supercharged Slider",
  "Zinger® Power Burger": "Zinger® Protein Pack"
}).map(([label, alias]) => [normalizeLookupLabel(label), normalizeLookupLabel(alias)]));

function createModifierImageResolver(catalogItems) {
  const labelImageMap = new Map();

  function register(label, image) {
    const normalized = normalizeLookupLabel(label);
    if (!normalized || !image || labelImageMap.has(normalized)) return;
    labelImageMap.set(normalized, image);
  }

  catalogItems.forEach((item) => {
    register(item.title, item.image);
    toArray(item.sizes).forEach((size) => {
      register(size.mealTitle, size.image);
      register(size.label, size.image);
    });
  });

  return function resolveModifierImage(label) {
    const normalized = normalizeLookupLabel(label);
    if (!normalized) return "";
    if (liveModifierImageOverrides.has(normalized)) return liveModifierImageOverrides.get(normalized);
    if (labelImageMap.has(normalized)) return labelImageMap.get(normalized);

    const alias = modifierImageAliases.get(normalized);
    if (alias) {
      if (liveModifierImageOverrides.has(alias)) return liveModifierImageOverrides.get(alias);
      if (labelImageMap.has(alias)) return labelImageMap.get(alias);
    }
    return "";
  };
}

function applyModifierImageFallbacks(groups, resolveModifierImage) {
  toArray(groups).forEach((group) => {
    toArray(group.options).forEach((option) => {
      if (!option.image) {
        option.image = resolveModifierImage(option.label);
      }
      applyModifierImageFallbacks(option.nestedModifierGroups, resolveModifierImage);
    });
  });
}

function splitTitleLines(label) {
  const text = String(label || "").trim();
  if (!text) return ["Menu"];
  if (text.includes(" & ")) {
    return text.split(" & ").reduce((lines, part, index, parts) => {
      if (index < parts.length - 1) {
        lines.push(part + " &");
      } else {
        lines.push(part);
      }
      return lines;
    }, []);
  }
  const words = text.split(/\s+/);
  if (words.length <= 2) return [text];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function getPropertyMap(entry) {
  return Object.fromEntries(
    toArray(entry && entry.additionalProperties).map((property) => [property.key, property.value])
  );
}

function inferFamily(categorySlug, product, visibleItems, sizes) {
  const title = String(product && product.name || "").toLowerCase();
  const joinedSizes = toArray(sizes)
    .map((size) => [size.label, size.note, size.id].filter(Boolean).join(" "))
    .join(" ")
    .toLowerCase();
  const joinedDescriptions = toArray(visibleItems)
    .map((entry) => [firstText(entry.shortDescription), firstText(entry.longDescription), entry.name].filter(Boolean).join(" "))
    .join(" ")
    .toLowerCase();
  const productProps = getPropertyMap(product);
  const itemProps = toArray(visibleItems).map((entry) => getPropertyMap(entry));
  const explicitType = String(productProps.type || "").toUpperCase();
  const explicitMealDealType = itemProps
    .map((props) => String(props.mealdealdetailid || props.type || "").toUpperCase())
    .find(Boolean) || "";

  if (categorySlug === "shared-meals") return "shared";
  if (categorySlug === "boxed-meals") return "box";
  if (categorySlug === "cold-drinks") return "drink";
  if (categorySlug === "charity-donations") return "other";
  if (/dessert|sundae|twirl|mousse|cookie|brownie|pie/i.test(title)) return "dessert";
  if (explicitType === "QUICK_COMBO" || explicitMealDealType === "QUICK_COMBO") return "combo";
  if (explicitType === "MENU_ITEM" || explicitMealDealType === "MENU_ITEM") return "ala-carte";
  if (/combo|meal/.test(title)) return "combo";
  if (/combo|meal/.test(joinedSizes)) return "combo";
  if (/chips?\s+and\s+(a\s+)?drink/.test(joinedDescriptions)) return "combo";
  return "ala-carte";
}

function inferPill(family, categoryLabel) {
  const byFamily = {
    "ala-carte": "Ala carte",
    combo: "Combo",
    box: "Box",
    shared: "Shared",
    drink: "Drink",
    dessert: "Dessert",
    other: "Item"
  };
  return byFamily[family] || titleCase(categoryLabel);
}

function inferModifierGroupMode(groupName, options) {
  const normalizedName = String(groupName || "").trim().toLowerCase();
  if (options.length <= 1) {
    return { selectionMode: "fixed", uiHint: "included" };
  }
  if (/^recipe$/.test(normalizedName)) {
    return { selectionMode: "multi", uiHint: "recipe" };
  }
  if (/^extras?$/.test(normalizedName)) {
    return { selectionMode: "multi", uiHint: "extras" };
  }
  if (/^modify\b/.test(normalizedName)) {
    return { selectionMode: "single", uiHint: "customize" };
  }
  return { selectionMode: "single", uiHint: "choice" };
}

function buildModifierGroups(modifierGroupDefs) {
  return toArray(modifierGroupDefs).map((group, groupIndex) => {
    const options = toArray(group.modifiers).map((modifier, optionIndex) => {
      const nestedImage = chooseImage(
        getImageFromContent(modifier.content),
        firstText(modifier.imageName)
      );
      return {
        id: slugify(modifier.id || modifier.name || ("option-" + optionIndex)),
        label: modifier.name || ("Option " + (optionIndex + 1)),
        summary: modifier.name || ("Option " + (optionIndex + 1)),
        priceDelta: 0,
        image: nestedImage,
        nestedModifierGroups: buildModifierGroups(modifier.modgrps)
      };
    }).filter((option) => option.label);
    const mode = inferModifierGroupMode(group.name, options);
    const defaultSelectedIds = mode.selectionMode === "multi" && mode.uiHint === "recipe"
      ? options.map((option) => option.id)
      : [];

    return {
      id: slugify(group.id || group.name || ("group-" + groupIndex)),
      label: group.name || ("Choice " + (groupIndex + 1)),
      defaultOptionId: options[0] ? options[0].id : "",
      defaultSelectedIds,
      selectionMode: mode.selectionMode,
      uiHint: mode.uiHint,
      options
    };
  }).filter((group) => group.options.length);
}

function buildSize(product, item, sizeIndex) {
  const shortDescription = firstText(item.shortDescription) || firstText(product.shortDescription);
  const longDescription = firstText(item.longDescription) || firstText(product.longDescription);
  const image = chooseImage(
    getImageFromContent(item.content),
    firstText(item.imageName),
    getImageFromContent(product.content),
    firstText(product.imageName)
  );
  const nutrition = toArray(item.content?.nutritionalInformation).map((entry) => ({
    nutritionComponent: entry.nutritionComponent || "",
    nutritionUnit: entry.nutritionUnit || "",
    serveWiseValue: firstNumber(entry.serveWiseValue),
    gramWiseValue: firstNumber(entry.gramWiseValue),
    isActive: entry.isActive !== false
  })).filter((entry) => entry.nutritionComponent);

  const allergens = toArray(item.content?.allergenInformation).map((entry) => ({
    allergenComponent: entry.allergenComponent || "",
    isPresent: !!entry.isPresent,
    isTrace: !!entry.isTrace
  })).filter((entry) => entry.allergenComponent);

  const sizeLabel = String(item.size || "").trim().replace(/^-+/, "") || titleCase(
    String(item.name || "")
      .replace(product.name || "", "")
      .replace(/^[\s-]+|[\s-]+$/g, "")
  ) || (sizeIndex === 0 ? "Item" : "Option " + (sizeIndex + 1));

  return {
    id: slugify(item.id || item.url || sizeLabel || ("size-" + sizeIndex)),
    label: sizeLabel,
    note: shortDescription || longDescription || "KFC Australia pickup item.",
    price: toCurrency(firstNumber(item.availability?.[0]?.price)),
    mealTitle: item.name || product.name || "",
    sourceItemId: item.id || "",
    sourceItemUrl: item.url || "",
    energy: firstNumber(item.content?.caloricValue),
    nutrition,
    allergens,
    modifierGroups: buildModifierGroups(item.modgrpIds),
    image
  };
}

function buildCategoryMeta(category) {
  const categoryLabel = category.name || category.url || "Menu";
  const categorySlug = category.url || slugify(categoryLabel);
  return {
    id: categorySlug,
    label: categoryLabel,
    hero: categoryLabel.toUpperCase(),
    image: chooseImage(
      getImageFromContent(category.content),
      firstText(category.imageName)
    ),
    lines: splitTitleLines(categoryLabel)
  };
}

function buildMenuData(source) {
  const root = source.categories?.[0];
  if (!root) {
    throw new Error("Could not find top-level menu category.");
  }

  const visibleCategories = toArray(root.categories).filter((category) => category && category.isHidden !== true);
  const categoryMeta = visibleCategories.map(buildCategoryMeta);
  const categoryMetaById = new Map(categoryMeta.map((entry) => [entry.id, entry]));
  const featuredCategoryId = "featured";

  const itemsById = new Map();
  const productImageMap = {};
  const galleryMap = {};
  const modifierImageMap = {};
  const sourceMatrix = [];

  visibleCategories.forEach((category) => {
    const categorySlug = category.url || slugify(category.name);
    const categoryLabel = category.name || categorySlug;
    toArray(category.products).forEach((product) => {
      const visibleItems = toArray(product.items).filter((entry) => entry && entry.isHidden !== true && entry.isCategoryHidden !== true);
      if (!visibleItems.length) return;

      const productId = slugify(product.url || product.id || product.name);
      const productImage = chooseImage(
        getImageFromContent(product.content),
        firstText(product.imageName),
        ...visibleItems.map((entry) => chooseImage(getImageFromContent(entry.content), firstText(entry.imageName)))
      );
      const gallery = Array.from(new Set(visibleItems.flatMap((entry) => ([
        chooseImage(getImageFromContent(entry.content), firstText(entry.imageName)),
        entry.content?.image?.secondaryImage || "",
        entry.content?.image?.tertiaryImage || ""
      ])).filter(Boolean)));
      const sizes = visibleItems.map((entry, sizeIndex) => buildSize(product, entry, sizeIndex));
      const family = inferFamily(categorySlug, product, visibleItems, sizes);

      const existing = itemsById.get(productId);
      const coreCategoryId = categorySlug === "featured-offers"
        ? null
        : categorySlug;

      if (!existing) {
        const normalized = {
          id: productId,
          sourceId: productId,
          featured: categorySlug === "featured-offers",
          pill: inferPill(family, categoryLabel),
          kicker: categoryLabel,
          title: product.name || productId,
          category: coreCategoryId || featuredCategoryId,
          description: firstText(product.longDescription) || firstText(product.shortDescription) || firstText(visibleItems[0].longDescription) || firstText(visibleItems[0].shortDescription) || "KFC Australia pickup item.",
          cta: "Open item",
          image: productImage,
          position: "center center",
          sizes,
          modifierGroups: sizes[0]?.modifierGroups || [],
          gallery,
          categoryIds: [categorySlug],
          sourceUrl: product.url ? ("https://www.kfc.com.au/menu/" + categorySlug + "/" + product.url) : "",
          productFamily: family
        };
        itemsById.set(productId, normalized);
      } else {
        existing.featured = existing.featured || categorySlug === "featured-offers";
        if (coreCategoryId && existing.category === featuredCategoryId) {
          existing.category = coreCategoryId;
        }
        if (!existing.categoryIds.includes(categorySlug)) {
          existing.categoryIds.push(categorySlug);
        }
        if (!existing.gallery.length && gallery.length) {
          existing.gallery = gallery;
        }
        if (!existing.image && productImage) {
          existing.image = productImage;
        }
      }

      sourceMatrix.push({
        id: productId,
        title: product.name || productId,
        family,
        modifierPattern: "real-menu",
        imageUrl: productImage,
        sourceUrl: product.url ? ("https://www.kfc.com.au/menu/" + categorySlug + "/" + product.url) : ""
      });
      });
  });

  const catalogItems = Array.from(itemsById.values())
    .filter((item) => item.category);
  const resolveModifierImage = createModifierImageResolver(catalogItems);

  catalogItems.forEach((item) => {
    applyModifierImageFallbacks(item.modifierGroups, resolveModifierImage);
    toArray(item.sizes).forEach((size) => {
      applyModifierImageFallbacks(size.modifierGroups, resolveModifierImage);
    });
  });
  const sortedCatalogItems = catalogItems
    .map((item) => {
      productImageMap[item.id] = item.image;
      galleryMap[item.id] = item.gallery.length ? item.gallery : [item.image].filter(Boolean);
      toArray(item.sizes).forEach((size) => {
        toArray(size.modifierGroups).forEach((group) => {
          toArray(group.options).forEach((option) => {
            if (option.image) {
              modifierImageMap[group.id + ":" + option.id] = option.image;
            }
          });
        });
      });
      return item;
    })
    .sort((left, right) => {
      const leftCategory = left.category === featuredCategoryId ? -1 : categoryMeta.findIndex((entry) => entry.id === left.category);
      const rightCategory = right.category === featuredCategoryId ? -1 : categoryMeta.findIndex((entry) => entry.id === right.category);
      if (leftCategory !== rightCategory) return leftCategory - rightCategory;
      return left.title.localeCompare(right.title);
    });

  const categoryItemsMap = sortedCatalogItems.reduce((acc, item) => {
    const categoryId = item.category;
    if (!categoryId) return acc;
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(item);
    return acc;
  }, {});

  const categoryOrder = [
    featuredCategoryId,
    ...categoryMeta
      .map((entry) => entry.id)
      .filter((categoryId) => categoryId !== "featured-offers")
      .filter((categoryId) => sortedCatalogItems.some((item) => item.category === categoryId))
  ];

  const plpCategories = categoryOrder.map((categoryId) => {
    if (categoryId === featuredCategoryId) {
      const featuredImage = (categoryItemsMap[featuredCategoryId] || [])[0]?.image
        || categoryMetaById.get("featured-offers")?.image
        || sortedCatalogItems[0]?.image
        || "";
      return { id: featuredCategoryId, label: "Featured Offers", hero: "FEATURED OFFERS", image: featuredImage };
    }
    const meta = categoryMetaById.get(categoryId);
    return {
      id: categoryId,
      label: meta?.label || titleCase(categoryId),
      hero: meta?.hero || titleCase(categoryId).toUpperCase(),
      image: (categoryItemsMap[categoryId] || [])[0]?.image || meta?.image || ""
    };
  });

  const categoryLabels = plpCategories.reduce((acc, category) => {
    acc[category.id] = category.label;
    return acc;
  }, {});

  const plpRailLabels = plpCategories.reduce((acc, category) => {
    acc[category.id] = category.label;
    return acc;
  }, {});

  const plpHeroLabels = plpCategories.reduce((acc, category) => {
    acc[category.id] = category.hero;
    return acc;
  }, {});

  const landingTiles = plpCategories.map((category, index) => ({
    id: category.id,
    lines: category.id === featuredCategoryId
      ? ["Featured", "Offers"]
      : splitTitleLines(category.label),
    image: (categoryItemsMap[category.id] || [])[0]?.image || category.image || sortedCatalogItems[0]?.image || "",
    className: index === 0 ? "is-accent-lime" : "",
    arrow: true
  }));

  const defaultItemId = sortedCatalogItems[0]?.id || "";
  const allIds = sortedCatalogItems.map((item) => item.id);

  return {
    menuData: {
      kfcMenuPhoto: categoryMetaById.get("featured-offers")?.image || categoryMeta[0]?.image || sortedCatalogItems[0]?.image || "",
      kfcAuCatalogItems: sortedCatalogItems,
      storeAssortments: {
        national: allIds,
        pickup: {
          elizabeth: allIds,
          wharf: allIds,
          central: allIds,
          chadstone: allIds
        },
        delivery: {
          elizabeth: allIds,
          wharf: allIds,
          central: allIds,
          chadstone: allIds
        }
      },
      productImageMap,
      productDetailGalleryMap: galleryMap,
      modifierImageMap,
      kfcAuProductSourceMatrix: sourceMatrix,
      kfcAuProductSourceById: sourceMatrix.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
      }, {}),
      kfcAuPrototypeAliases: {},
      defaultMenuCategory: categoryOrder[0] || featuredCategoryId,
      defaultMenuItemId: defaultItemId
    },
    productRules: {
      categoryLabels,
      categoryOrder,
      plpCategoryOrder: categoryOrder,
      plpRailLabels,
      plpHeroLabels,
      plpCategories,
      menuLandingTiles: landingTiles,
      demoItemsPerCategory: 6,
      demoMenuLabels: [],
      demoMenuAdjectives: ["New", "Classic", "Popular", "Loaded", "Crispy", "Original"],
      demoMenuFormats: ["Meal", "Combo", "Pick", "Favourite", "Choice", "Box"],
      secretMenuCampaign: {
        holdSeconds: 11,
        clueLabel: "Hidden Drop",
        clueTitle: "Hold To Unlock",
        clueCopy: "Press and keep holding until the countdown clears. The clue opens a limited prototype-only secret menu.",
        entryItemId: "secret-zinger-double",
        items: [
          {
            id: "secret-zinger-double",
            secretMenu: true,
            featured: false,
            pill: "Secret Menu",
            kicker: "KFC prototype",
            title: "Secret Zinger Double",
            category: "secret",
            description: "Limited prototype burger build using the same KFC product image family.",
            image: catalogItems.find((item) => item.category === "burgers")?.image || catalogItems[0]?.image || "",
            position: "center 24%",
            sizes: [{ id: "single", label: "Item", note: "Single secret item", price: 12.95 }],
            secretPdp: {
              posterLabel: "SECRET\nMENU"
            }
          }
        ]
      }
    }
  };
}

function formatOutput(data) {
  return `(function () {\n  window.KFCAuMenuData = ${JSON.stringify(data, null, 2)};\n})();\n`;
}

function main() {
  const sourcePath = process.argv[2] || DEFAULT_SOURCE;
  const targetPath = process.argv[3] || DEFAULT_TARGET;
  const payload = buildMenuData(readJson(sourcePath));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, formatOutput(payload));
  console.log(`Generated ${targetPath}`);
}

main();
