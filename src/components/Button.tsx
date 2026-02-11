import "./Button.css"

interface Props {
  text: string;
  handleButtonClick: () => void;
}

function Button({ text, handleButtonClick }: Props) {
  return (
    <button className="btn btn-dark" onClick={handleButtonClick}>
      {text}
    </button>
  );
}

export default Button;
