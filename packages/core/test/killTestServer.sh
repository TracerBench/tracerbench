set -e
set -o pipefail

pid=$(ps -ef|grep -i "test-server"|sort -k5,5|awk '{print $2}'|head -1)
#echo "stop test server $pid"
kill -9 $pid