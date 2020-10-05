const get = (obj: any, path: string, defaultValue = undefined) => {
    const travel = (regexp: RegExp) =>
      path.split(regexp)
          .filter(Boolean)
          .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
  };

export default get;