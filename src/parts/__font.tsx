const ID = 'autoAddMontserrat';

export const add = (d: typeof document): void => {
  if(d.getElementById(ID) !== null) return;

  d.head.insertAdjacentHTML(
    'afterbegin',
    `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id='${ ID }' href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    `,
  );
};

