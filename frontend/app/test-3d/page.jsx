import BodySelector from "@/components/BodySelector";

export const metadata = {
  title: "3D Body Selector Test",
};

export default function Test3DPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Interactive 3D Body Selector</h1>
        <p className="text-gray-600 text-center mb-8">
          Click anywhere on the model to pinpoint an exact location. The system will use heuristics to identify the body part.
        </p>
        
        <BodySelector />
      </div>
    </div>
  );
}
