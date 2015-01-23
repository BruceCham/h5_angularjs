:: Call 从一个批处理程序调用另一个批处理程序，并且不终止父批处理程序。
:: aim at window seajs module build
:: get seajs module root path
ECHO `spm build` executing... path %1 
spm build -I %1