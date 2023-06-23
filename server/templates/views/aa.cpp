#include <bits/stdc++.h>
using namespace std;
#define lp(i, a, b) for (int i = a; i < b; i++)
#define lp1(i, a, b) for (int i = a - 1; i >= b; i--)
#define ll long long
#define deb(x) cout << #x << x << endl
#define all(x) x.begin(), x.end()
#define fast_io                       \
    ios_base::sync_with_stdio(false); \
    cin.tie(NULL);                    \
    cout.tie(NULL);
typedef pair<int, int> pii;
typedef vector<int> vi;
typedef vector<pii> vpii;
typedef vector<vi> vvi;
const int MOD = 1'000'000'007;

vi prime_num;

void SieveOfEratosthenes(int n)
{
    bool prime[n + 1];
    memset(prime, true, sizeof(prime));
    for (int p = 2; p * p <= n; p++)
    {
        if (prime[p] == true)
        {
            for (int i = p * p; i <= n; i += p)
                prime[i] = false;
        }
    }

    for (int p = 2; p <= n; p++)
    {
        if (prime[p])
            prime_num.push_back(p);
    }
}

int main()
{
    fast_io

        int t = 1;
    cin >> t;
    while (t--)
    {

        int n;
        cin >> n;
        int p[n];
        lp(i, 0, n) cin >> p[i];

        vector<int> v[100001];
        lp(i,0,n){
            v[p[i]].
        }
    }
    return 0;
}