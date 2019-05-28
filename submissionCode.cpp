
#include <bits/stdc++.h> 
using namespace std; 
int main()
{
 set<int>colors; int color; for (int i = 0; i < 4; ++i)
{
 cin>>color; colors.insert(color); 
}
 cout<<4 - (int)colors.size()<<endl; return 0; 
}
