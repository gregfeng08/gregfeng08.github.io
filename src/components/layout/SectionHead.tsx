// Reused section header: № NN · italic serif title · right-aligned mono note.
export default function SectionHead({
  num,
  title,
  note,
  id,
}: {
  num: string;
  title: string;
  note?: string;
  id?: string;
}) {
  return (
    <div className="sechead grid g-meta" id={id}>
      <div className="sechead__num">№ {num}</div>
      <div className="sechead__title">{title}</div>
      <div className="sechead__note">{note}</div>
    </div>
  );
}
