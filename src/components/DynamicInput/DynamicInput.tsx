import { SortByType } from "@/types/SortBy.type";
import "./DynamicInput.scss";

interface DynamicInputProps {
  type: SortByType;
}
const DynamicInput = ({ type }: DynamicInputProps) => {
  switch (type) {
    case SortByType.Date:
      return (
        <div className="DynamicInput">
          <div className="input-container">
            <label htmlFor="date-debut">Début</label>
            <input type="date" id="date-debut" placeholder="Début" />
          </div>
          <div className="input-container">
            <label htmlFor="">Fin</label>
            <input type="date" placeholder="Fin" />
          </div>
        </div>
      );
    case SortByType.Prix:
      return (
        <div className="DynamicInput">
          <div className="input-container">
            <label htmlFor="min">Min</label>
            <input type="number" id="min" placeholder="Min" />
          </div>
          <div className="input-container">
            <label htmlFor="max">Max</label>
            <input type="number" id="max" placeholder="Max" />
          </div>
        </div>
      );
    default:
      return null;
  }
};
export default DynamicInput;
