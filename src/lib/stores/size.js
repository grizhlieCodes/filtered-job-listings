const returnBreakpoint = (variable, pixels) => {
    if (pixels >= 1110) {
        variable.set('desktop') 
    } else if (pixels >= 768) {
        variable.set('tablet') 
    } else {
        variable.set('mobile') 
    }
}

export default returnBreakpoint