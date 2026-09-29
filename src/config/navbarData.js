// ================================================================
// NAVBAR DATA (Temporary — পরে Admin Panel থেকে dynamic হবে)
// ================================================================

export const NAVBAR_MENU = [
  {
    label: "Home",
    url: "/",
    hasDropdown: false,
  },
  {
    label: "Shop",
    url: "/shop",
    hasDropdown: false,
  },
  {
    label: "Thobe",
    url: "/thobe",
    hasDropdown: true,
    dropdown: {
      columns: [
        {
          title: "Shop by Category",
          items: [
            { label: "Premium Panjabi", url: "/c/premium-panjabi" },
            { label: "Classic Panjabi", url: "/c/classic-panjabi" },
            { label: "Pakistani Panjabi", url: "/c/pakistani-panjabi" },
            { label: "Band Collar", url: "/c/band-collar" },
          ],
        },
      ],
      featured: {
        image: "",
        title: "Signature Thobe",
        cta: "Shop Now",
        url: "/thobe",
      },
    },
  },
  {
    label: "Panjabi",
    url: "/panjabi",
    hasDropdown: true,
    dropdown: {
      columns: [
        {
          title: "Shop by Category",
          items: [
            { label: "Premium Panjabi", url: "/c/premium-panjabi" },
            { label: "Classic Panjabi", url: "/c/classic-panjabi" },
            { label: "Pakistani Panjabi", url: "/c/pakistani-panjabi" },
            { label: "Band Collar", url: "/c/band-collar" },
          ],
        },
      ],
      featured: {
        image: "",
        title: "Eid Panjabi Collection",
        cta: "Shop Eid",
        url: "/panjabi",
      },
    },
  },
  {
    label: "Fabrics",
    url: "/fabrics",
    hasDropdown: true,
    dropdown: {
      columns: [
        {
          title: "Shop by Fabric",
          items: [
            { label: "Cotton", url: "/c/cotton" },
            { label: "Premium Cotton", url: "/c/premium-cotton" },
            { label: "Linen", url: "/c/linen" },
            { label: "Pakistani Fabric", url: "/c/pakistani-fabric" },
            { label: "Turkish Fabric", url: "/c/turkish-fabric" },
          ],
        },
      ],
      featured: {
        image: "",
        title: "Premium Fabrics",
        cta: "Explore",
        url: "/fabrics",
      },
    },
  },
  {
    label: "Custom Thobe",
    url: "/custom-thobe",
    hasDropdown: false,
  },
  {
    label: "Collections",
    url: "/collections",
    hasDropdown: false,
  },
  {
    label: "About",
    url: "/about",
    hasDropdown: false,
  },
];
