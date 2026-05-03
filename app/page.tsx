import ModelHeader from "./components/ModelHeader";
import ModelSelector from "./components/ModelSelector";
import PorscheModel from "./components/PorscheModel";
import TechnicalSpecs from "./components/TechnicalSpecs";
import ModelPreview from "./components/ModelPreview";
import { TwoStackedPhoto, OneBigPhoto } from './components/FeaturePhotos';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-white">
      <main className="flex w-full flex-col items-center bg-white text-black">
        <PorscheModel />
        <ModelSelector />
        <ModelHeader />
        <TechnicalSpecs />
        <ModelPreview />
        <TwoStackedPhoto
          title="All Around Lights (ALL) system"
          description="Every curve serves a purpose"
          imageLeft="/features/aal/aal-1.png"
          imageRight="/features/aal/aal-2.png"
        />

        <OneBigPhoto
          // title="Mastering the Turn"
          // description="Where precision aerodynamics and raw power redefine every corner."
          image="/porsche-static-model/5.png"
          imagePosition="bottom"
        />
      </main>
    </div>
  );
}