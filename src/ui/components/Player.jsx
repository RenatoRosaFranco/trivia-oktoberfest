export const Player = ({ player, index }) => {
  const { name, score } = player;

  return (
    <div className="player mb-3 pb-0 p-3 border rounded shadow-sm">
      <h5 className="fw-bold">#{index + 1} {name}</h5>
      <hr />
      <p>Pontos: {score}</p>
    </div>
  );
}
