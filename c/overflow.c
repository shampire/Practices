#include <stdio.h>
#include <stdlib.h>

void return_input()
{
    char array[20];
    gets(array);
    printf("%s\n", array);
}

int main(int argc, char **argv)
{
    return_input();
}
