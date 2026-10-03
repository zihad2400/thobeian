export const metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with THOBEIAN's size guide.",
};

const SIZE_CHART = [
  { size: "S", chest: "38", waist: "32-34", shoulder: "17", length: "54" },
  { size: "M", chest: "40", waist: "34-36", shoulder: "18", length: "56" },
  { size: "L", chest: "42", waist: "36-38", shoulder: "19", length: "58" },
  { size: "XL", chest: "44", waist: "38-40", shoulder: "20", length: "60" },
  { size: "XXL", chest: "46", waist: "40-42", shoulder: "21", length: "62" },
  { size: "3XL", chest: "48", waist: "42-44", shoulder: "22", length: "62" },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-white">
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Find Your Fit</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Size Guide</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            All measurements in inches. For the perfect fit, measure carefully.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="overflow-x-auto">
          <table className="w-full border border-border">
            <thead className="bg-charcoal text-white">
              <tr>
                <th className="p-4 text-left text-xs uppercase tracking-widest">Size</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest">Chest</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest">Waist</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest">Shoulder</th>
                <th className="p-4 text-left text-xs uppercase tracking-widest">Length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? "bg-background-luxury" : "bg-white"}>
                  <td className="p-4 font-medium text-charcoal">{row.size}</td>
                  <td className="p-4 text-text-secondary">{row.chest}"</td>
                  <td className="p-4 text-text-secondary">{row.waist}"</td>
                  <td className="p-4 text-text-secondary">{row.shoulder}"</td>
                  <td className="p-4 text-text-secondary">{row.length}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-border p-8">
          <h2 className="font-serif text-2xl text-charcoal mb-4">How to Measure</h2>
          <ul className="space-y-3 text-text-secondary">
            <li><strong className="text-charcoal">Chest:</strong> Measure around the fullest part of your chest.</li>
            <li><strong className="text-charcoal">Waist:</strong> Measure around your natural waistline.</li>
            <li><strong className="text-charcoal">Shoulder:</strong> Measure from one shoulder point to the other.</li>
            <li><strong className="text-charcoal">Length:</strong> Measure from shoulder to desired bottom length.</li>
          </ul>
        </div>

        <div className="bg-gold/5 border border-gold/30 p-6">
          <p className="text-sm text-charcoal">
            💡 <strong>Custom size?</strong> Use our <a href="/custom-thobe" className="text-gold underline">Custom Thobe</a> service for exact measurements.
          </p>
        </div>
      </div>
    </div>
  );
}
