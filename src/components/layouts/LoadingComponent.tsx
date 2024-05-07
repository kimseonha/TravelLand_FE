import logoGif from '/assets/logoGif.gif';
export const LoadingComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '1400px',
        height: 'auto',
        paddingTop: '250px',
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <img src={logoGif} alt="Spinner" />
    </div>
  );
};
