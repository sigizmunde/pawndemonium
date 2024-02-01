import { Cell } from "@/types";
import { FunctionComponent } from "react";

type SpotProps = {
    onSpotClick?: Function;
    cell: Cell;
}

// TODO: unify Pers and Spot
export const Spot: FunctionComponent<SpotProps> = ({
    onSpotClick = () => {},
    cell,
  }) => {
    const coordX = (cell[0] * 100) / 8;
    const coordY = (cell[1] * 100) / 8;
  
    const handleClick = () => {
      onSpotClick();
    };
  
    return (
      <div
        className="spot"
        style={{
          position: 'absolute',
          left: `${coordX}%`,
          bottom: `${coordY}%`,
          width: '6.25vh',
          height: '6.25vh',
          zIndex: 2,
        }}
      >
        <button
          type="button"
          className="spot-button"
          style={{ backgroundColor: "#00aa2255" }}
          onClick={handleClick}
        />
      </div>
    );
  };