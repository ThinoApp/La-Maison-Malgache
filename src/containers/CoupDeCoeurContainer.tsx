import CoupDeCoeur from "@/UI/CoupDeCoeur/CoupDeCoeur";
import { listes } from "@/data/CoupsDeCoeur";

const CoupDeCoeurContainer = () => {
  return (
    <>
      <CoupDeCoeur listes={listes} />
    </>
  );
};

export default CoupDeCoeurContainer;
