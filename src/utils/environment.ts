const environment = () => {
    return {
        MILJO: (window as any)?.appSettings?.MILJO ?? 'local'
    };
};

export default environment();
