export const Cursor = (props) => {
  const { x, y, username, color, style } = props;

  return x ? (
    <div
      style={{
        position: "fixed",
        top: `${y}px`,
        left: `${x}px`,
        zIndex: 999999,
        cursor: style,
      }}
    >
      <svg width="32" height="44" viewBox="0 0 24 36" fill="none">
        <path
          fill={color}
          d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
        />
      </svg>
      <span
        style={{
          top: 0,
          left: 0,
          height: "2rem",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          backgroundColor: color,
          marginLeft: "1rem",
          marginTop: "-2rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          color: "black",
        }}
        className="flex items-center relative rounded-full"
      >
        {username}
      </span>
    </div>
  ) : (
    <></>
  );
};
